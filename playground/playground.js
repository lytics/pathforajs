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

  var INLINE_HOST = '#pg-inline-host';
  var RENDER_DEBOUNCE = 400;

  var el = {};
  var state = { ctor: null, type: null, layout: null, config: null };
  var mode = 'form';
  var manualSnippet = null;
  var renderTimer = null;
  var stageStarted = false;

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

    return prune(config);
  }

  function snippetFor(config) {
    return (
      'var widget = new pathfora.' +
      state.ctor +
      '(' +
      JSON.stringify(config, null, 2) +
      ');\n\npathfora.initializeWidgets([widget]);\n'
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

  function renderCurrent() {
    run(currentSnippet());
  }

  function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(renderCurrent, RENDER_DEBOUNCE);
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
    }

    return control;
  }

  function commit(path, field, raw, structural) {
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

  function buildForm() {
    var form = el.form;

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

        var structural =
          field.type === 'select' || field.type === 'bool' ? true : false;
        var control = makeControl(
          field,
          toDisplay(field, getPath(state.config, field.key)),
          function (raw) {
            commit(field.key, field, raw, structural);
          },
        );

        group.appendChild(labelled(field, control));
      });

      form.appendChild(group);
    });
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
    if (
      stageStarted ||
      !el.stage.contentWindow ||
      !el.stage.contentWindow.pathfora
    ) {
      return;
    }

    stageStarted = true;
    watchStage();
    selectEntry(CATALOGUE[0], CATALOGUE[0].layouts[0]);
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
