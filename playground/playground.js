/**
 * Pathfora widget playground.
 *
 * Renders any valid type/layout combination against the local dist/ build.
 * Settings can be driven from a form or written by hand as JavaScript.
 *
 * Widgets live in the stage iframe (playground/stage.html), not in this page, so
 * the sidebar and toolbar can never sit on top of one.
 */
(function () {
  'use strict';

  // Every key prefix pathfora persists under, from src/rollup/globals/config.js.
  // Impressions and recommendations also go to sessionStorage, so both stores
  // have to be swept - see clearStoredState below.
  var STORAGE_PREFIXES = [
    'PathforaRecommend_',
    'PathforaUnlocked_',
    'PathforaImpressions_',
    'PathforaTotalImpressionsSince_',
    'PathforaConfirm_',
    'PathforaCancel_',
    'PathforaClosed_',
    'PathforaTest_',
    'PathforaPageView',
  ];

  // The valid type x layout matrix, per the switch statements in
  // src/rollup/widgets/construct-widget-layout.js. SiteGate is deprecated and
  // deliberately absent - its confirm button is dead code anyway, because
  // construct-widget-actions.js never assigns it a widgetAction. Form with
  // layout "gate" is the working equivalent.
  var CATALOGUE = [
    {
      ctor: 'Message',
      type: 'message',
      layouts: ['modal', 'slideout', 'bar', 'gate', 'button', 'inline'],
    },
    {
      ctor: 'Form',
      type: 'form',
      layouts: ['modal', 'slideout', 'gate', 'inline'],
    },
    {
      ctor: 'Subscription',
      type: 'subscription',
      layouts: ['modal', 'slideout', 'bar', 'gate', 'inline'],
    },
  ];

  // Defaults only where the layout accepts a position. Gate is deliberately
  // absent: validateWidgetPosition has no case for it, so setting one
  // dereferences an undefined `choices` and throws.
  var DEFAULT_POSITION = {
    slideout: 'bottom-left',
    bar: 'top-absolute',
    button: 'top-left',
  };

  // Errors that are a known library quirk rather than something wrong with the
  // config in front of you. Matched narrowly so genuine failures still surface.
  var KNOWN_ERRORS = [
    {
      match: /Cannot add two widgets with the same id/,
      note:
        'A targeted widget was rendered while the tag was still starting up, ' +
        'so it initialised twice - add-callback.js registers the callback with ' +
        'jstag.entityReady and also pushes it onto pathfora.callbacks, and the ' +
        'tag drains that queue as it comes up. Harmless, and it does not ' +
        'happen once the tag has settled. Render again.',
    },
  ];

  var INLINE_HOST = '#pg-inline-host';
  var RENDER_DEBOUNCE = 400;
  // targeted renders reload the stage frame, so they get a longer leash
  var TARGETED_DEBOUNCE = 900;

  // The error form state only fires for a confirmAction with
  // waitForAsyncResponse, which needs a real callback - and a function cannot
  // survive JSON.stringify. So the config carries a sentinel string and
  // snippetFor swaps it for source on the way out.
  var CALLBACK_SENTINEL = '__pg_async_';
  var ASYNC_CALLBACK = {
    success: 'function (name, payload, done) {\n    done(true);\n  }',
    error: 'function (name, payload, done) {\n    done(false);\n  }',
  };

  var el = {};
  var state = { ctor: null, type: null, layout: null, config: null };
  var mode = 'form';
  var manualSnippet = null;
  var renderTimer = null;
  var stageStarted = false;
  var tagWaits = 0;
  var pendingSnippet = null;
  var entityFields = [];

  // Forward reference. commit() and the repeating-row controls need to rebuild
  // the form, and buildForm is what creates those controls in the first place.
  var rebuildForm = function () {};

  function byId(id) {
    return document.getElementById(id);
  }

  function keyFor(ctor, layout) {
    return ctor + '/' + layout;
  }

  function setStatus(text) {
    el.status.textContent = text;
  }

  function showError(message) {
    el.error.textContent = message;
    el.error.hidden = false;
  }

  function hideError() {
    el.error.textContent = '';
    el.error.hidden = true;
  }

  function stageWindow() {
    return el.stage.contentWindow;
  }

  function stageDocument() {
    return el.stage.contentDocument;
  }

  /* ---------- config paths ---------- */

  function setPath(obj, path, value) {
    var parts = path.split('.');
    var cursor = obj;
    var i;
    var key;

    for (i = 0; i < parts.length - 1; i++) {
      key = parts[i];

      if (cursor[key] === undefined || cursor[key] === null) {
        cursor[key] = String(Number(parts[i + 1])) === parts[i + 1] ? [] : {};
      }

      cursor = cursor[key];
    }

    cursor[parts[parts.length - 1]] = value;
  }

  function getPath(obj, path) {
    return path.split('.').reduce(function (cursor, key) {
      return cursor === undefined || cursor === null ? undefined : cursor[key];
    }, obj);
  }

  function clearPath(obj, path) {
    var parts = path.split('.');
    // a single-segment path has no parent path to walk - getPath('') would
    // return undefined and the delete would silently do nothing
    var parent =
      parts.length === 1 ? obj : getPath(obj, parts.slice(0, -1).join('.'));

    if (parent && typeof parent === 'object') {
      delete parent[parts[parts.length - 1]];
    }
  }

  // Drop the empty objects left behind when every field under a branch is unset,
  // so the generated config stays readable
  function prune(obj) {
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        prune(value);

        if (Object.keys(value).length === 0) {
          delete obj[key];
        }
      }
    });

    return obj;
  }

  /* ---------- stage ---------- */

  function isPathforaKey(key) {
    return STORAGE_PREFIXES.some(function (prefix) {
      return key.indexOf(prefix) === 0;
    });
  }

  function sweep(store) {
    var doomed = [];
    var i;

    for (i = 0; i < store.length; i++) {
      if (isPathforaKey(store.key(i))) {
        doomed.push(store.key(i));
      }
    }

    doomed.forEach(function (key) {
      store.removeItem(key);
    });

    return doomed.length;
  }

  /**
   * pathfora.clearAll() resets in-memory trackers only - it never touches
   * storage. Without this a submitted gate stays unlocked and impression caps
   * stay spent, across renders and across reloads, which makes repeat testing
   * baffling.
   */
  function clearStoredState() {
    var win = stageWindow();
    var cleared = 0;

    try {
      cleared += sweep(win.localStorage);
      cleared += sweep(win.sessionStorage);
    } catch (storageError) {
      showError('Could not clear storage: ' + storageError.message);
    }

    stageDocument()
      .cookie.split(';')
      .forEach(function (entry) {
        var name = entry.split('=')[0].trim();

        if (name && isPathforaKey(name)) {
          win.pathfora.utils.deleteCookie(name);
          cleared++;
        }
      });

    return cleared;
  }

  function describeRendered() {
    var nodes = stageDocument().querySelectorAll('.pf-widget');

    if (!nodes.length) {
      return 'Nothing rendered';
    }

    return (
      'Rendered: ' +
      Array.prototype.map
        .call(nodes, function (node) {
          return node.id;
        })
        .join(', ')
    );
  }

  function clearWidgets() {
    try {
      stageWindow().pathfora.clearAll();
    } catch (clearError) {
      // clearAll on an empty tracker is harmless; never block a render on it
      window.console.debug('clearAll: ' + clearError.message);
    }
  }

  function run(snippet) {
    var doc = stageDocument();
    var script;

    hideError();
    clearWidgets();

    if (!el.preserve.checked) {
      clearStoredState();
    }

    if (!stageWindow().pathfora) {
      showError('The stage frame has not finished loading the SDK yet.');
      return;
    }

    // Injected as a script element rather than eval'd so it runs in the stage's
    // own scope. Errors thrown here reach the stage window's error handler,
    // wired up in watchStage, rather than this call stack.
    script = doc.createElement('script');
    script.textContent = snippet;
    doc.body.appendChild(script);
    doc.body.removeChild(script);

    if (el.error.hidden) {
      setStatus(describeRendered());

      // A targeted widget goes in through addCallback, which defers to
      // jstag.entityReady - so it is not in the DOM yet when the status above
      // is read. Look again once the tag has had a chance to answer.
      window.setTimeout(function () {
        if (el.error.hidden) {
          setStatus(describeRendered());
        }
      }, 600);
    }
  }

  /* ---------- snippet ---------- */

  function context() {
    // config is null until an entry is picked, and gating predicates read
    // through it - ctx.config.theme and friends must not throw on first paint
    return {
      type: state.type,
      layout: state.layout,
      config: state.config || {},
      fields: entityFields,
    };
  }

  function applies(item) {
    return typeof item.applies !== 'function' || item.applies(context());
  }

  function buildConfig() {
    if (!state.config) {
      return null;
    }

    var config = JSON.parse(JSON.stringify(state.config));

    // Drop anything whose control is not currently applicable, so clearing the
    // theme takes its colours with it and the emitted config never carries a
    // key the current layout would choke on
    window.PlaygroundFields.sections.forEach(function (section) {
      var sectionApplies = applies(section);

      section.fields.forEach(function (field) {
        if (!sectionApplies || !applies(field)) {
          clearPath(config, field.key);
        }
      });
    });

    // validate-recommendation-widget throws unless the default flag is set
    if (config.content && config.content[0]) {
      config.content[0].default = true;
    }

    // Playground-only controls, not part of a widget config
    delete config.targetSegment;
    delete config.excludeSegment;
    delete config.attributeField;
    delete config.attributeOp;
    delete config.attributeValue;

    // simulateSubmit is a playground-only control - turn it into the async
    // confirmAction that drives the success and error states
    var simulate = config.simulateSubmit;
    delete config.simulateSubmit;

    if (simulate) {
      config.confirmAction = {
        waitForAsyncResponse: true,
        callback: CALLBACK_SENTINEL + simulate,
      };
    }

    return prune(config);
  }

  /**
   * Targeted widgets go in through the object form of initializeWidgets rather
   * than a plain array. The segment is matched against getUserSegments(), which
   * only returns anything real once the Lytics tag is loaded.
   */
  function initCall() {
    var config = state.config || {};
    var segment = config.targetSegment;
    var excluded = config.excludeSegment;
    var attribute = config.attributeField;
    var targets = [];
    var parts = [];

    if (!segment && !excluded && !attribute) {
      return 'pathfora.initializeWidgets([widget]);';
    }

    if (segment) {
      targets.push(
        '{ segment: ' + JSON.stringify(segment) + ', widgets: [widget] }'
      );
    }

    if (attribute) {
      var op = config.attributeOp || 'eq';
      var raw = config.attributeValue;
      // gt/gte/lt/lte parseInt the attribute, so the operand has to be a number
      var operand =
        ['gt', 'gte', 'lt', 'lte'].indexOf(op) === -1
          ? JSON.stringify(raw === undefined ? '' : raw)
          : Number(raw) || 0;

      targets.push(
        '{ rule: pathfora.rules.' +
          op +
          '(' +
          JSON.stringify(attribute) +
          ', ' +
          operand +
          '), widgets: [widget] }'
      );
    }

    // one target list, not one key per entry - and segment and rule cannot
    // share an entry, validateWidgetsObject throws if they do
    if (targets.length) {
      parts.push('  target: [\n    ' + targets.join(',\n    ') + '\n  ]');
    }

    if (excluded) {
      parts.push(
        '  exclude: [{ segment: ' +
          JSON.stringify(excluded) +
          ', widgets: [widget] }]'
      );
    }

    return 'pathfora.initializeWidgets({\n' + parts.join(',\n') + '\n});';
  }

  function snippetFor(config) {
    var json = JSON.stringify(config, null, 2).replace(
      new RegExp('"' + CALLBACK_SENTINEL + '(success|error)"', 'g'),
      function (match, outcome) {
        return ASYNC_CALLBACK[outcome];
      }
    );

    return (
      'var widget = new pathfora.' +
      state.ctor +
      '(' +
      json +
      ');\n\n' +
      initCall() +
      '\n'
    );
  }

  function currentSnippet() {
    if (mode === 'config' && manualSnippet !== null) {
      return manualSnippet;
    }

    var config = buildConfig();

    // nothing is selected yet on first paint
    return config ? snippetFor(config) : '';
  }

  function syncEditor() {
    el.editor.value = currentSnippet();
  }

  function isTargeted() {
    return Boolean(
      state.config &&
        (state.config.targetSegment ||
          state.config.excludeSegment ||
          state.config.attributeField)
    );
  }

  /**
   * A targeted widget reaches the DOM through addCallback. On this account the
   * entity has no `user` key, so the jstag.entityReady branch never calls back
   * and the only path that fires is the tag draining pathfora.callbacks - which
   * it does once, while starting up. Rendering again into the same page
   * therefore queues a callback nobody will ever drain. Reloading the stage
   * gives the tag another pass, which is what makes repeat renders work.
   */
  function renderCurrent() {
    var snippet = currentSnippet();

    if (isTargeted() && el.tag.checked) {
      pendingSnippet = snippet;
      stageStarted = false;
      tagWaits = 0;
      el.stage.src = '/playground/stage.html?tag=1&r=' + Date.now();
      return;
    }

    run(snippet);
  }

  function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(
      renderCurrent,
      isTargeted() && el.tag.checked ? TARGETED_DEBOUNCE : RENDER_DEBOUNCE
    );
  }

  /* ---------- form controls ---------- */

  function toStored(field, raw) {
    if (raw === '' || raw === null || raw === undefined) {
      return undefined;
    }

    switch (field.type) {
      case 'number':
        return Number(raw);
      case 'bool':
        return raw === 'true';
      case 'csv':
        return raw
          .split(',')
          .map(function (part) {
            return part.trim();
          })
          .filter(Boolean);
      case 'options':
        return raw
          .split(',')
          .map(function (part) {
            return part.trim();
          })
          .filter(Boolean)
          .map(function (part) {
            return { label: part, value: part };
          });
      default:
        return raw;
    }
  }

  function toDisplay(field, value) {
    if (value === undefined || value === null) {
      return '';
    }

    if (field.type === 'bool') {
      return String(value);
    }

    if (field.type === 'csv') {
      return value.join(', ');
    }

    if (field.type === 'options') {
      return value
        .map(function (option) {
          return option.value;
        })
        .join(', ');
    }

    return String(value);
  }

  function labelled(field, control) {
    var wrap = document.createElement('label');
    var name = document.createElement('span');

    wrap.className = 'pg-field';
    name.className = 'pg-field-label';
    name.textContent = field.label;
    wrap.appendChild(name);
    wrap.appendChild(control);

    if (field.note) {
      var note = document.createElement('span');
      note.className = 'pg-field-note';
      note.textContent = field.note;
      wrap.appendChild(note);
    }

    return wrap;
  }

  function makeControl(field, value, onChange) {
    var control;
    var options;

    if (field.type === 'bool' || field.type === 'select') {
      control = document.createElement('select');
      options =
        field.type === 'bool'
          ? ['', 'true', 'false']
          : typeof field.optionsFor === 'function'
            ? field.optionsFor(context())
            : field.options || [];

      options.forEach(function (option) {
        var node = document.createElement('option');
        node.value = option;
        node.textContent = option === '' ? '—' : option;
        control.appendChild(node);
      });

      control.value = value;
      control.addEventListener('change', function () {
        onChange(control.value, true);
      });
    } else if (field.type === 'textarea') {
      control = document.createElement('textarea');
      control.rows = 2;
      control.value = value;
      control.addEventListener('input', function () {
        onChange(control.value, false);
      });
    } else if (field.type === 'color') {
      control = document.createElement('span');
      control.className = 'pg-color';

      var hex = document.createElement('input');
      hex.type = 'text';
      hex.placeholder = '#rrggbb';
      hex.value = value;

      var swatch = document.createElement('input');
      swatch.type = 'color';
      swatch.value = /^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff';

      hex.addEventListener('input', function () {
        onChange(hex.value, false);
      });
      swatch.addEventListener('input', function () {
        hex.value = swatch.value;
        onChange(swatch.value, false);
      });

      control.appendChild(hex);
      control.appendChild(swatch);
    } else if (field.type === 'datalist') {
      // free text, because you may want to target a segment this visitor is not
      // in, with the visitor's own segments offered as suggestions
      control = document.createElement('span');
      control.className = 'pg-datalist';

      var text = document.createElement('input');
      var list = document.createElement('datalist');

      list.id = 'pg-list-' + field.key.replace(/[^a-z0-9]+/gi, '-');
      text.type = 'text';
      text.value = value;
      text.setAttribute('list', list.id);

      (typeof field.optionsFor === 'function'
        ? field.optionsFor(context())
        : field.options || []
      ).forEach(function (option) {
        var node = document.createElement('option');

        // suggestions may be plain slugs or { value, label } pairs
        if (option && typeof option === 'object') {
          node.value = option.value;
          node.label = option.label;
          node.textContent = option.label;
        } else {
          node.value = option;
        }

        list.appendChild(node);
      });

      text.addEventListener('input', function () {
        onChange(text.value, false);
      });

      if (field.structural) {
        // rebuilding on every keystroke would take the focus out of the field
        // mid-word, so a gating text field settles on change instead
        text.addEventListener('change', function () {
          onChange(text.value, true);
        });
      }

      control.appendChild(text);
      control.appendChild(list);
    } else {
      control = document.createElement('input');
      control.type =
        field.type === 'number'
          ? 'number'
          : field.type === 'datetime'
            ? 'datetime-local'
            : 'text';
      control.value = value;
      control.addEventListener('input', function () {
        onChange(control.value, false);
      });

      if (field.structural) {
        control.addEventListener('change', function () {
          onChange(control.value, true);
        });
      }
    }

    return control;
  }

  function commit(path, field, raw, structural) {
    if (!state.config) {
      return;
    }

    var value = toStored(field, raw);

    if (value === undefined) {
      clearPath(state.config, path);
    } else {
      setPath(state.config, path, value);
    }

    syncEditor();

    if (structural) {
      // gating depends on config values - theme custom reveals the colour
      // fields, a top-positioned bar reveals pushDown
      rebuildForm();
      renderCurrent();
    } else {
      scheduleRender();
    }
  }

  function listControl(field) {
    var wrap = document.createElement('div');
    var rows = getPath(state.config, field.key) || [];
    var add = document.createElement('button');

    wrap.className = 'pg-list';

    rows.forEach(function (row, index) {
      var rowEl = document.createElement('div');
      var remove = document.createElement('button');

      rowEl.className = 'pg-list-row';

      field.row.forEach(function (sub) {
        var path = field.key + '.' + index + '.' + sub.key;
        var control = makeControl(
          sub,
          toDisplay(sub, row[sub.key]),
          function (raw) {
            commit(path, sub, raw, false);
          },
        );

        control.setAttribute('data-pg-key', path);
        rowEl.appendChild(labelled(sub, control));
      });

      remove.type = 'button';
      remove.className = 'pg-list-remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', function () {
        rows.splice(index, 1);

        if (!rows.length) {
          clearPath(state.config, field.key);
        }

        syncEditor();
        rebuildForm();
        renderCurrent();
      });

      rowEl.appendChild(remove);
      wrap.appendChild(rowEl);
    });

    add.type = 'button';
    add.className = 'pg-list-add';
    add.textContent = 'Add ' + field.label;
    add.addEventListener('click', function () {
      var next = getPath(state.config, field.key) || [];
      var blank = {};

      field.row.forEach(function (sub) {
        if (sub.type === 'select' && sub.options && sub.options.length) {
          blank[sub.key] = sub.options[0];
        }
      });

      next.push(blank);
      setPath(state.config, field.key, next);
      syncEditor();
      rebuildForm();
    });

    wrap.appendChild(add);

    return wrap;
  }

  /** Where the caret and the scroll position were, so a rebuild can put them back */
  function formFocus() {
    var active = document.activeElement;
    var holder = active && active.closest ? active.closest('[data-pg-key]') : null;
    var caret = null;

    if (active && typeof active.selectionStart === 'number') {
      caret = active.selectionStart;
    }

    return {
      scroll: el.form.scrollTop,
      key: holder ? holder.getAttribute('data-pg-key') : null,
      caret: caret,
    };
  }

  function restoreFormFocus(saved) {
    el.form.scrollTop = saved.scroll;

    if (!saved.key) {
      return;
    }

    var holder = el.form.querySelector('[data-pg-key="' + saved.key + '"]');

    if (!holder) {
      return;
    }

    var input = holder.matches('input, select, textarea')
      ? holder
      : holder.querySelector('input, select, textarea');

    if (!input) {
      return;
    }

    input.focus();

    if (saved.caret !== null && typeof input.setSelectionRange === 'function') {
      input.setSelectionRange(saved.caret, saved.caret);
    }
  }

  /**
   * Keys on the visitor's Lytics profile, for the attribute suggestions.
   *
   * addCallback hands a rule `e.data.user`, so that - not the top level of the
   * entity, which is just { user, errors } - is what an attribute rule reads.
   * The legacy lio shape puts the same fields at the top of data.
   */
  function readEntityFields() {
    var win = stageWindow();

    try {
      if (win.jstag && typeof win.jstag.getEntity === 'function') {
        var data = (win.jstag.getEntity() || {}).data;

        if (data) {
          return Object.keys(data.user || data);
        }
      }
    } catch (entityError) {
      window.console.debug('getEntity: ' + entityError.message);
    }

    return [];
  }

  function buildForm() {
    var form = el.form;
    var saved = formFocus();

    // read once per rebuild rather than per field, since context() is called
    // for every applies() check
    entityFields = readEntityFields();

    form.innerHTML = '';

    window.PlaygroundFields.sections.forEach(function (section) {
      if (!applies(section)) {
        return;
      }

      var fields = section.fields.filter(applies);

      if (!fields.length) {
        return;
      }

      var group = document.createElement('section');
      var heading = document.createElement('h2');

      group.className = 'pg-section';
      heading.className = 'pg-section-title';
      heading.textContent = section.title;
      group.appendChild(heading);

      if (section.requiresTag && !el.tag.checked) {
        var warn = document.createElement('p');
        warn.className = 'pg-section-warn';
        warn.textContent =
          'Needs the Lytics tag. Switch it on in the toolbar - without it ' +
          'there is no account to call and no profile to match against.';
        group.appendChild(warn);
      }

      if (section.intro) {
        var intro = document.createElement('p');
        intro.className = 'pg-section-intro';
        intro.textContent = section.intro;
        group.appendChild(intro);
      }

      fields.forEach(function (field) {
        if (field.type === 'list') {
          var listWrap = document.createElement('div');
          var listLabel = document.createElement('span');

          listWrap.className = 'pg-field pg-field-list';
          listLabel.className = 'pg-field-label';
          listLabel.textContent = field.label;
          listWrap.appendChild(listLabel);
          listWrap.appendChild(listControl(field));
          group.appendChild(listWrap);
          return;
        }

        var control = makeControl(
          field,
          toDisplay(field, getPath(state.config, field.key)),
          function (raw, isStructural) {
            // makeControl says whether this particular event is structural:
            // false while typing, true once the value settles. Ignoring it
            // rebuilt the form on every keystroke.
            commit(field.key, field, raw, Boolean(isStructural));
          },
        );

        control.setAttribute('data-pg-key', field.key);
        group.appendChild(labelled(field, control));
      });

      form.appendChild(group);
    });

    restoreFormFocus(saved);
  }

  rebuildForm = buildForm;

  /* ---------- catalogue and modes ---------- */

  function baseConfig(ctor, layout) {
    var config = {
      id: 'playground-' + ctor.toLowerCase() + '-' + layout,
      layout: layout,
      headline: ctor + ' / ' + layout,
      msg: 'This is a ' + layout + ' rendered from the playground.',
    };

    if (DEFAULT_POSITION[layout]) {
      config.position = DEFAULT_POSITION[layout];
    }

    if (layout === 'inline') {
      config.positionSelector = INLINE_HOST;
    }

    return config;
  }

  function setMode(next) {
    mode = next;

    el.modeForm.classList.toggle('is-active', mode === 'form');
    el.modeConfig.classList.toggle('is-active', mode === 'config');
    el.form.hidden = mode !== 'form';
    el.editor.readOnly = mode === 'form';
    el.editorHint.textContent =
      mode === 'form'
        ? 'Generated from the form — switch to Config to edit by hand'
        : 'Runs as JavaScript, same shape as the examples in docs/docs/examples/src';

    if (mode === 'form') {
      manualSnippet = null;
    }

    syncEditor();
  }

  function selectEntry(entry, layout) {
    Array.prototype.forEach.call(
      el.catalogue.querySelectorAll('button'),
      function (button) {
        button.classList.toggle(
          'is-active',
          button.dataset.key === keyFor(entry.ctor, layout),
        );
      },
    );

    state.ctor = entry.ctor;
    state.type = entry.type;
    state.layout = layout;
    state.config = baseConfig(entry.ctor, layout);
    manualSnippet = null;

    buildForm();
    syncEditor();
    renderCurrent();
  }

  function buildCatalogue() {
    CATALOGUE.forEach(function (entry) {
      var section = document.createElement('div');
      var heading = document.createElement('h2');

      section.className = 'pg-group';
      heading.className = 'pg-group-title';
      heading.textContent = entry.ctor;
      section.appendChild(heading);

      entry.layouts.forEach(function (layout) {
        var button = document.createElement('button');

        button.type = 'button';
        button.textContent = layout;
        button.dataset.key = keyFor(entry.ctor, layout);
        button.addEventListener('click', function () {
          selectEntry(entry, layout);
        });

        section.appendChild(button);
      });

      el.catalogue.appendChild(section);
    });
  }

  /**
   * Surface anything the stage throws. Widgets can fail well after the click
   * that created them - a showDelay widget throws from inside a timeout - and a
   * config with a syntax error never reaches a try/catch here at all.
   */
  function watchStage() {
    stageWindow().addEventListener('error', function (event) {
      var known = KNOWN_ERRORS.filter(function (entry) {
        return entry.match.test(event.message);
      })[0];

      if (known) {
        showError(known.note);
        setStatus(describeRendered());
        return;
      }

      showError(event.message);
      setStatus('Render failed');
    });
  }

  /**
   * Runs once, when the stage is genuinely usable.
   *
   * readyState is not a trustworthy signal here: a freshly created iframe
   * reports 'complete' for its own initial blank document, well before
   * stage.html and the SDK inside it have loaded. Rendering against that gives
   * "pathfora is not defined". The SDK being present is the real signal.
   */
  function stageReady() {
    var win = el.stage.contentWindow;

    if (stageStarted || !win || !win.pathfora) {
      return;
    }

    // With the real tag the account id comes from jstag.config.cid, which only
    // exists once the tag script has loaded - rendering a targeted widget
    // before then throws "Could not get account id". Bounded, so a blocked or
    // offline request cannot leave the playground empty forever.
    // cid only exists once the tag script has loaded. It is not a perfect
    // signal - the tag is still wiring up its own pathfora integration for a
    // moment afterwards - but jstag.entityReady is not stubbed by the loader
    // snippet, so it cannot be called any earlier than this to get a better one.
    if (
      win.pgTagRequested &&
      !(win.jstag && win.jstag.config && win.jstag.config.cid)
    ) {
      tagWaits++;

      if (tagWaits < 60) {
        return;
      }

      showError('The Lytics tag did not load - targeting will not match.');
    }

    stageStarted = true;
    watchStage();

    // The profile arrives after the tag script does, so the attribute
    // suggestions are empty at this point. entityReady is a real function now
    // that the tag has loaded - it is not stubbed by the loader snippet - so
    // rebuild once the profile lands. buildForm keeps scroll and focus, so this
    // is not disruptive.
    if (win.pgTagRequested && typeof win.jstag.entityReady === 'function') {
      win.jstag.entityReady(function () {
        if (state.config) {
          buildForm();
        }
      });
    }

    if (pendingSnippet) {
      var queued = pendingSnippet;
      pendingSnippet = null;
      run(queued);
      return;
    }

    if (!state.config) {
      selectEntry(CATALOGUE[0], CATALOGUE[0].layouts[0]);
      return;
    }

    // the stage was reloaded under an existing selection - keep it, and render
    // straight into the fresh frame rather than asking for another reload
    buildForm();
    run(currentSnippet());
  }

  function init() {
    el.catalogue = byId('pg-catalogue');
    el.form = byId('pg-form');
    el.editor = byId('pg-editor');
    el.editorHint = byId('pg-editor-hint');
    el.error = byId('pg-error');
    el.status = byId('pg-status');
    el.preserve = byId('pg-preserve');
    el.stage = byId('pg-stage');
    el.tag = byId('pg-tag');
    el.modeForm = byId('pg-mode-form');
    el.modeConfig = byId('pg-mode-config');

    hideError();
    buildCatalogue();

    el.modeForm.addEventListener('click', function () {
      setMode('form');
    });

    el.modeConfig.addEventListener('click', function () {
      manualSnippet = el.editor.value;
      setMode('config');
    });

    el.editor.addEventListener('input', function () {
      if (mode === 'config') {
        manualSnippet = el.editor.value;
      }
    });

    byId('pg-render').addEventListener('click', renderCurrent);

    el.tag.addEventListener('change', function () {
      var on = el.tag.checked;

      // the tag has to be installed before the SDK runs, so the frame is
      // reloaded rather than having the tag injected into a live page
      stageStarted = false;
      tagWaits = 0;
      setStatus(on ? 'Loading the Lytics tag…' : 'Reloading without the tag…');
      el.stage.src = '/playground/stage.html' + (on ? '?tag=1' : '');
    });

    byId('pg-panels').addEventListener('click', function () {
      var panels = byId('pg-panels');
      var collapsed = document.body.classList.toggle('pg-collapsed');

      var label = collapsed ? 'Show panels' : 'Hide panels';

      // the button holds an icon, so the name has to come from the attributes
      panels.setAttribute('aria-label', label);
      panels.setAttribute('title', label);
      panels.setAttribute('aria-expanded', String(!collapsed));
    });

    byId('pg-clear').addEventListener('click', function () {
      clearWidgets();
      setStatus('Cleared');
    });

    byId('pg-reset').addEventListener('click', function () {
      clearWidgets();
      setStatus('Cleared ' + clearStoredState() + ' stored key(s)');
    });

    setMode('form');

    // Handle both orders: the iframe may load after this script runs, or it may
    // have loaded already and never fire another load event.
    el.stage.addEventListener('load', stageReady);

    var poll = window.setInterval(function () {
      stageReady();

      if (stageStarted) {
        window.clearInterval(poll);
      }
    }, 50);
  }

  init();
}());
