/**
 * Pathfora widget playground.
 *
 * Renders any valid type/layout combination against the local dist/ build, and
 * lets you edit the config and render again. See the README for how to run it.
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
  // src/rollup/widgets/construct-widget-layout.js. Anything else throws.
  var CATALOGUE = [
    {
      ctor: 'Message',
      layouts: ['modal', 'slideout', 'bar', 'gate', 'button', 'inline'],
    },
    {
      ctor: 'Subscription',
      layouts: ['modal', 'slideout', 'bar', 'gate', 'inline'],
    },
    { ctor: 'Form', layouts: ['modal', 'slideout', 'gate', 'inline'] },
    { ctor: 'SiteGate', layouts: ['gate'] },
  ];

  // Defaults only where the layout actually accepts a position. Gate is
  // deliberately absent: validateWidgetPosition has no case for it, so setting
  // one dereferences an undefined `choices` and throws.
  var DEFAULT_POSITION = {
    slideout: 'bottom-left',
    bar: 'top-absolute',
    button: 'top-left',
  };

  // Known-broken combinations, surfaced in the UI so nobody debugs them twice.
  var CAVEATS = {
    'SiteGate/gate':
      'Known issue: the Confirm button does nothing. ' +
      'construct-widget-actions.js never assigns a widgetAction for type ' +
      '"sitegate", so the click handler returns early. Use Form with layout ' +
      '"gate" for a working gate.',
  };

  var INLINE_HOST = '#pg-inline-host';

  var el = {};
  var activeKey = null;

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

  function snippetFor(ctor, layout) {
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

    return (
      'var widget = new pathfora.' +
      ctor +
      '(' +
      JSON.stringify(config, null, 2) +
      ');\n\npathfora.initializeWidgets([widget]);\n'
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

  function render(snippet) {
    var doc = stageDocument();
    var script;

    hideError();
    clearWidgets();

    if (!el.preserve.checked) {
      clearStoredState();
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

  function selectEntry(ctor, layout) {
    activeKey = keyFor(ctor, layout);

    Array.prototype.forEach.call(
      el.catalogue.querySelectorAll('button'),
      function (button) {
        button.classList.toggle('is-active', button.dataset.key === activeKey);
      }
    );

    el.editor.value = snippetFor(ctor, layout);
    render(el.editor.value);

    // A caveat is context rather than a failure, so it goes up after the render
    if (CAVEATS[activeKey] && el.error.hidden) {
      showError(CAVEATS[activeKey]);
    }
  }

  function buildCatalogue() {
    CATALOGUE.forEach(function (group) {
      var section = document.createElement('div');
      var heading = document.createElement('h2');

      section.className = 'pg-group';
      heading.className = 'pg-group-title';
      heading.textContent = group.ctor;
      section.appendChild(heading);

      group.layouts.forEach(function (layout) {
        var button = document.createElement('button');

        button.type = 'button';
        button.textContent = layout;
        button.dataset.key = keyFor(group.ctor, layout);

        if (CAVEATS[keyFor(group.ctor, layout)]) {
          button.classList.add('has-caveat');
          button.title = 'Known issue - see the note when selected';
        }

        button.addEventListener('click', function () {
          selectEntry(group.ctor, layout);
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

  function init() {
    el.catalogue = byId('pg-catalogue');
    el.editor = byId('pg-editor');
    el.error = byId('pg-error');
    el.status = byId('pg-status');
    el.preserve = byId('pg-preserve');
    el.stage = byId('pg-stage');

    hideError();
    buildCatalogue();

    byId('pg-render').addEventListener('click', function () {
      render(el.editor.value);
    });

    byId('pg-clear').addEventListener('click', function () {
      clearWidgets();
      setStatus('Cleared');
    });

    byId('pg-reset').addEventListener('click', function () {
      clearWidgets();
      setStatus('Cleared ' + clearStoredState() + ' stored key(s)');
    });

    el.stage.addEventListener('load', watchStage);
    setStatus('Pick a widget to render');
  }

  init();
}());
