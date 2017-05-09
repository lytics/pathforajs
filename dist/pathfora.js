(function () {
'use strict';

/** @module pathfora/add-callback */

function addCallback (cb) {
  if (window.lio && window.lio.loaded) {
    cb(window.lio.data);
  } else {
    this.callbacks.push(cb);
  }
}

/** @module pathfora/on-dom-ready */

function onDOMready (fn) {
  var handler,
      pf = this,
      hack = document.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

  if (!loaded) {
    document.addEventListener(domContentLoaded, handler = function () {
      document.removeEventListener(domContentLoaded, handler);
      pf.DOMLoaded = true;
      fn();
    });
  } else {
    pf.DOMLoaded = true;
    fn();
  }
}

/** @module pathfora/init-pageviews */

function initializePageViews () {
  var cookie = utils.readCookie(PF_PAGEVIEWS),
      date = new Date();
  date.setDate(date.getDate() + 365);
  utils.saveCookie(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1, date);
}

/** @module pathfora/trigger-widgets */

function triggerWidgets (widgetIds) {
  var pf = this;
  var i, valid;

  // no widget ids provided, trigger all ready widgets
  if (typeof widgetIds === 'undefined') {
    pf.triggeredWidgets['*'] = true;

    for (i = 0; i < core.readyWidgets.length; i++) {
      valid = core.triggerWidget(core.readyWidgets[i]);
      if (valid) {
        i--;
      }
    }

  // trigger all widget ids provided
  } else {
    widgetIds.forEach(function (id) {
      if (pf.triggeredWidgets[id] !== false) {
        pf.triggeredWidgets[id] = true;
      }

      for (i = 0; i < core.readyWidgets.length; i++) {
        valid = core.triggerWidget(core.readyWidgets[i]);
        if (valid) {
          i--;
        }
      }
    });
  }
}

/** @module core/validate-widgets-object */

function validateWidgetsObject (widgets) {
  if (!widgets) {
    throw new Error('Widgets not specified');
  }

  if (!(widgets instanceof Array) && widgets.target) {
    widgets.common = widgets.common || [];

    for (var i = 0; i < widgets.target.length; i++) {
      if (!widgets.target[i].segment) {
        throw new Error('All targeted widgets should have segment specified');
      } else if (widgets.target[i].segment === '*') {
        widgets.common = widgets.common.concat(widgets.target[i].widgets);
        widgets.target.splice(i, 1);
      }
    }
  }
}

/** @module core/track-time-on-page */

function trackTimeOnPage () {
  this.tickHandler = setInterval(function () {
    pathforaDataObject.timeSpentOnPage += 1;
  }, 1000);
}

/** @module core/date-checker */

function dateChecker (date) {
  var valid = true,
      today = Date.now();

  if (date.start_at && today < new Date(date.start_at).getTime()) {
    valid = false;
  }

  if (date.end_at && today > new Date(date.end_at).getTime()) {
    valid = false;
  }

  return valid;
}

/** @module core/page-visits-checker */

function pageVisitsChecker (pageVisitsRequired) {
  return (this.pageViews >= pageVisitsRequired);
}

/** @module config */

var PREFIX_UNLOCK = 'PathforaUnlocked_';
var PREFIX_IMPRESSION = 'PathforaImpressions_';
var PREFIX_CONFIRM$1 = 'PathforaConfirm_';
var PREFIX_CANCEL$1 = 'PathforaCancel_';
var PREFIX_CLOSE$1 = 'PathforaClosed_';
var PREFIX_AB_TEST = 'PathforaTest_';

/** @module core/hide-after-action-checker */

function hideAfterActionChecker (hideAfterActionConstraints, widget) {
  var parts,
      valid = true,
      now = Date.now(),
      confirm = utils.readCookie(PREFIX_CONFIRM$1 + widget.id),
      cancel = utils.readCookie(PREFIX_CANCEL$1 + widget.id),
      closed = utils.readCookie(PREFIX_CLOSE$1 + widget.id);

  if (hideAfterActionConstraints.confirm && confirm) {
    parts = confirm.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.confirm.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.cancel && cancel) {
    parts = cancel.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.cancel.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
      valid = false;
    }
  }

  if (hideAfterActionConstraints.closed && closed) {
    parts = closed.split('|');

    if (parseInt(parts[0], 10) >= hideAfterActionConstraints.closed.hideCount) {
      valid = false;
    }

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
      valid = false;
    }
  }

  return valid;
}

/** @module utils/escape-uri */

function escapeURI (text, options) {
  // NOTE This was ported from various bits of C++ code from Chromium
  options || (options = {});

  var length = text.length,
      escaped = [],
      usePlus = options.usePlus || false,
      keepEscaped = options.keepEscaped || false;

  function isHexDigit (c) {
    return /[0-9A-Fa-f]/.test(c);
  }

  function toHexDigit (i) {
    return '0123456789ABCDEF'[i];
  }

  function containsChar (charMap, charCode) {
    return (charMap[charCode >> 5] & (1 << (charCode & 31))) !== 0;
  }

  function isURISeparator (c) {
    return ['#', ':', ';', '/', '?', '$', '&', '+', ',', '@', '='].indexOf(c) !== -1;
  }

  function shouldEscape (charText) {
    return !isURISeparator(charText) && containsChar([
      0xffffffff, 0xf80008fd, 0x78000001, 0xb8000001,
      0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff
    ], charText.charCodeAt(0));
  }

  for (var index = 0; index < length; index++) {
    var charText = text[index],
        charCode = text.charCodeAt(index);

    if (usePlus && charText === ' ') {
      escaped.push('+');
    } else if (keepEscaped && charText === '%' && length >= index + 2 &&
        isHexDigit(text[index + 1]) &&
        isHexDigit(text[index + 2])) {
      escaped.push('%');
    } else if (shouldEscape(charText)) {
      escaped.push('%',
        toHexDigit(charCode >> 4),
        toHexDigit(charCode & 0xf));
    } else {
      escaped.push(charText);
    }
  }

  return escaped.join('');
}

/** @module core/parse-query */

function parseQuery (url) {
  var query = {},
      pieces = escapeURI(url, { keepEscaped: true }).split('?');

  if (pieces.length > 1) {
    pieces = pieces[1].split('&');

    for (var i = 0; i < pieces.length; i++) {
      var pair = pieces[i].split('=');

      if (pair.length > 1) {
        // NOTE We should not account for the preview id
        if (pair[0] !== 'lytics_variation_preview_id') {
          query[pair[0]] = pair[1];
        }
      }
    }
  }

  return query;
}

/** @module core/compare-queries */

function compareQueries (query, matchQuery, rule) {
  switch (rule) {
  case 'exact':
    if (Object.keys(matchQuery).length !== Object.keys(query).length) {
      return false;
    }
    break;

  default:
    break;
  }

  for (var key in matchQuery) {
    if (matchQuery.hasOwnProperty(key) && matchQuery[key] !== query[key]) {
      return false;
    }
  }

  return true;
}

/** @module core/phrase-checker */

function phraseChecker (phrase, url, simpleurl, queries) {
  var valid = false;

  // legacy match allows for an array of strings, check if we are legacy or current object approach
  switch (typeof phrase) {
  case 'string':
    if (url.indexOf(escapeURI(phrase.split('?')[0], { keepEscaped: true })) !== -1) {
      valid = compareQueries(queries, parseQuery(phrase), 'substring');
    }
    break;

  case 'object':
    if (phrase.match && phrase.value) {
      var phraseValue = utils.escapeURI(phrase.value, { keepEscaped: true });

      switch (phrase.match) {
      // simple match
      case 'simple':
        if (simpleurl.slice(-1) === '/') {
          simpleurl = simpleurl.slice(0, -1);
        }

        if (phrase.value.slice(-1) === '/') {
          phrase.value = phrase.value.slice(0, -1);
        }

        if (simpleurl === phrase.value) {
          valid = true;
        }
        break;

      // exact match
      case 'exact':
        if (url.split('?')[0].replace(/\/$/, '') === phraseValue.split('?')[0].replace(/\/$/, '')) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
        }
        break;

      // regex
      case 'regex':
        var re = new RegExp(phrase.value);

        if (re.test(url)) {
          valid = true;
        }
        break;

      // string match (default)
      default:
        if (url.indexOf(phraseValue.split('?')[0]) !== -1) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
        }
        break;
      }

    } else {
      console.log('invalid display conditions');
    }
    break;

  default:
    console.log('invalid display conditions');
    break;
  }

  return valid;
}

/** @module core/url-checker */

function urlChecker (phrases) {
  var url = escapeURI(window.location.href, { keepEscaped: true }),
      simpleurl = window.location.hostname + window.location.pathname,
      queries = parseQuery(url),
      valid, excludeValid = false,
      matchCt, excludeCt = 0;

  if (!(phrases instanceof Array)) {
    phrases = Object.keys(phrases).map(function (key) {
      return phrases[key];
    });
  }

  // array of urlContains params is an or list, so if any are true evaluate valid to true
  if (phrases.indexOf('*') === -1) {
    phrases.forEach(function (phrase) {
      if (phrase.exclude) {
        excludeValid = phraseChecker(phrase, url, simpleurl, queries) || excludeValid;
        excludeCt++;
      } else {
        valid = phraseChecker(phrase, url, simpleurl, queries) || valid;
        matchCt++;
      }
    });
  } else {
    valid = true;
  }

  if (matchCt === 0) {
    return !excludeValid;
  }

  if (excludeCt === 0) {
    return valid;
  }

  return valid && !excludeValid;
}

/** @module utils/read-cookie */

function readCookie (name) {
  var cookies = document.cookie,
      findCookieRegexp = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  return findCookieRegexp ? findCookieRegexp.pop() : null;
}

/** @module core/impressions-checker */

function impressionsChecker (impressionConstraints, widget) {
  var parts, totalImpressions,
      valid = true,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 0;
  }

  if (!total) {
    totalImpressions = 0;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10);

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
      valid = false;
    }
  }

  if (sessionImpressions >= impressionConstraints.session || totalImpressions >= impressionConstraints.total) {
    valid = false;
  }

  return valid;
}

/** @module core/validate-watchers */

function validateWatchers (widget, cb) {
  var valid = true;

  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
      valid = widget.valid && widget.watchers[key].check();
    }
  }

  if (widget.displayConditions.impressions && valid) {
    valid = core.impressionsChecker(widget.displayConditions.impressions, widget);
  }

  if (valid) {
    context.pathfora.showWidget(widget);
    widget.valid = false;
    cb();

    return true;
  }

  return false;
}

/** @module core/init-exit-intent */

function initializeExitIntent (widget) {
  var positions = [];
  if (!this.exitIntentListener) {
    this.exitIntentListener = function (e) {
      positions.push({
        x: e.clientX,
        y: e.clientY
      });
      if (positions.length > 30) {
        positions.shift();
      }
    };

    widget.exitIntentTrigger = function (e) {
      var from = e.relatedTarget || e.toElement;

      // When there is registered movement and leaving the root element
      if (positions.length > 1 && (!from || from.nodeName === 'HTML')) {
        var valid;

        var y = positions[positions.length - 1].y;
        var py = positions[positions.length - 2].y;
        var ySpeed = Math.abs(y - py);

        // Did the cursor move up?
        // Is it reasonable to believe that it left the top of the page, given the position and the speed?
        valid = widget.valid && y - ySpeed <= 50 && y < py;

        if (valid) {
          validateWatchers(widget, function () {
            if (typeof document.addEventListener === 'function') {
              document.removeEventListener('mousemove', widget.exitIntentListener);
              document.removeEventListener('mouseout', widget.exitIntentTrigger);
            } else {
              document.onmousemove = null;
              document.onmouseout = null;
            }
          });
        }

        positions = [];
      }
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof document.addEventListener === 'function') {
      document.addEventListener('mousemove', widget.exitIntentListener, false);
      document.addEventListener('mouseout', widget.exitIntentTrigger, false);
    } else {
      document.onmousemove = widget.exitIntentListener;
      document.onmouseout = widget.exitIntentTrigger;
    }
  }
  return true;
}

/** @module core/register-element-watcher */

function registerElementWatcher (selector, widget) {
  var watcher = {
    elem: document.querySelector(selector),

    check: function () {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
          scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;

      if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
        core.removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}

/** @module core/init-scroll-watchers */

function initializeScrollWatchers (widget) {
  var core = this;
  if (!core.scrollListener) {
    widget.scrollListener = function () {
      validateWatchers(widget, function () {
        if (typeof document.addEventListener === 'function') {
          document.removeEventListener('scroll', widget.scrollListener);
        } else {
          context.onscroll = null;
        }
      });
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof context.addEventListener === 'function') {
      context.addEventListener('scroll', widget.scrollListener, false);
    } else {
      context.onscroll = widget.scrollListener;
    }
  }
  return true;
}

/** @module core/register-position-watcher */

function registerPositionWatcher (percent, widget) {
  var watcher = {
    check: function () {
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
          positionInPixels = height * (percent / 100),
          offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset >= positionInPixels) {
        core.removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}

/** @module core/register-manual-trigger-watcher */

/** @module core/displayConditions/manualTrigger/trigger-widget */

var jstag = window.jstag;

var ga = window.ga;

/** @module api/request/report-data */

function reportData (data) {
  var gaLabel;

  if (typeof jstag === 'object') {
    jstag.send(data);
  } else {
    // NOTE Cannot find Lytics tag, reporting disabled
  }

  if (typeof ga === 'function') {
    gaLabel = data['pf-widget-action'] || data['pf-widget-event'];

    ga(
      'send',
      'event',
      'Lytics',
      data['pf-widget-id'] + ' : ' + gaLabel,
      '',
      {
        nonInteraction: true
      }
    );
  }
}

/** @module core/track-widget-action */

function trackWidgetAction (action, widget, htmlElement) {
  var child, elem, i;

  var params = {
    'pf-widget-id': widget.id,
    'pf-widget-type': widget.type,
    'pf-widget-layout': widget.layout,
    'pf-widget-variant': widget.variant
  };

  if (widget.recommend && widget.content && widget.content.length > 0) {
    params['pf-widget-content'] = widget.content[0];
  }

  switch (action) {
  case 'show':
    pathforaDataObject.displayedWidgets.push(params);
    break;
  case 'close':
    params['pf-widget-action'] = !!widget.closeAction && widget.closeAction.name || 'close';
    pathforaDataObject.closedWidgets.push(params);
    break;
  case 'confirm':
    if (htmlElement && utils.hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else {
      params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || 'default confirm';
      pathforaDataObject.completedActions.push(params);
    }
    break;
  case 'cancel':
    params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || 'default cancel';
    pathforaDataObject.cancelledActions.push(params);
    break;
  case 'submit':
  case 'unlock':
    if (utils.hasClass(htmlElement, 'pf-custom-form')) {
      params['pf-custom-form'] = {};
    }

    for (elem in htmlElement.children) {
      if (htmlElement.children.hasOwnProperty(elem)) {
        child = htmlElement.children[elem];

        if (utils.hasClass(child, 'pf-widget-radio-group') || utils.hasClass(child, 'pf-widget-checkbox-group')) {
          var values = [],
              name = '',
              inputs = child.querySelectorAll('input');

          for (i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.checked) {
              name = input.getAttribute('name');
              values.push(input.value);
            }
          }

          if (name !== '') {
            params['pf-custom-form'][name] = values;
          }
        } else if (child && typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          params['pf-form-' + child.getAttribute('name')] = child.value;
        } else if (utils.hasClass(htmlElement, 'pf-custom-form') && child && child.querySelector) {
          var val = child.querySelector('input, select, textarea');

          if (val && typeof val.getAttribute !== 'undefined' && val.getAttribute('name') !== null) {
            params['pf-custom-form'][val.getAttribute('name')] = val.value;
          }
        }
      }
    }

    if (action === 'unlock') {
      utils.saveCookie(PREFIX_UNLOCK + widget.id, true, core.expiration);
    }

    break;
  case 'subscribe':
    params['pf-form-email'] = htmlElement.elements.email.value;
    break;
  case 'hover':
    if (utils.hasClass(htmlElement, 'pf-content-unit')) {
      params['pf-widget-action'] = 'content recommendation';
    } else if (utils.hasClass(htmlElement, 'pf-widget-ok')) {
      params['pf-widget-action'] = 'confirm';
    } else if (utils.hasClass(htmlElement, 'pf-widget-cancel')) {
      params['pf-widget-action'] = 'cancel';
    } else if (utils.hasClass(htmlElement, 'pf-widget-close')) {
      params['pf-widget-action'] = 'close';
    }
    break;
  case 'focus':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  case 'form_start':
    if (htmlElement && typeof htmlElement.getAttribute !== 'undefined' && htmlElement.getAttribute('name') !== null) {
      params['pf-widget-action'] = htmlElement.getAttribute('name');
    }
    break;
  }

  params['pf-widget-event'] = action;
  reportData(params);
}

/** @module utils/save-cookie */

function saveCookie (name, value, expiration) {
  var expires;

  if (expiration) {
    expires = '; expires=' + expiration.toUTCString();
  } else {
    expires = '; expires=0';
  }

  context.document.cookie = [
    name,
    '=',
    value,
    expires,
    '; path = /'
  ].join('');
}

/** @module core/increment-impressions */

function incrementImpressions (widget) {
  var parts, totalImpressions,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 1;
  } else {
    sessionImpressions += 1;
  }

  if (!total) {
    totalImpressions = 1;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10) + 1;
  }

  sessionStorage.setItem(id, sessionImpressions);
  saveCookie(id, Math.min(totalImpressions, 9998) + '|' + now, core.expiration);
}

/** @module config/positions */

var defaultPositions = {
  modal: '',
  slideout: 'bottom-left',
  button: 'top-left',
  bar: 'top-absolute',
  folding: 'bottom-left'
};

/** @module core/validate-widget-position */

function validateWidgetPosition (widget, config) {
  var choices;

  switch (config.layout) {
  case 'modal':
    choices = [''];
    break;
  case 'slideout':
    choices = ['bottom-left', 'bottom-right', 'left', 'right', 'top-left', 'top-right'];
    break;
  case 'bar':
    choices = ['top-absolute', 'top-fixed', 'bottom-fixed'];
    break;
  case 'button':
    choices = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    break;
  case 'folding':
    choices = ['left', 'bottom-left', 'bottom-right'];
    break;
  case 'inline':
    choices = [];
    break;
  }

  if (choices.indexOf(config.position) === -1) {
    // NOTE config.position + ' is not valid position for ' + config.layout
  }
}

/** @module core/setup-widget-position */

function setupWidgetPosition (widget, config) {
  if (config.position) {
    validateWidgetPosition(widget, config);
  } else {
    config.position = defaultPositions[config.layout];
  }
}

/** @module utils/has-class */

function hasClass (DOMNode, className) {
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(DOMNode.className);
}

/** @module utils/remove-class */

function removeClass (DOMNode, className) {
  var findClassRegexp = new RegExp([
    '(^|\\b)',
    className.split(' ').join('|'),
    '(\\b|$)'
  ].join(''), 'gi');

  DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
}

/** @module pathfora/widgets/close-widget */

function closeWidget$1 (id, noTrack) {
  var node = document.getElementById(id);

  // FIXME Change to Array#some or Array#filter
  for (var i = 0; i < core.openedWidgets.length; i++) {
    if (core.openedWidgets[i].id === id) {
      if (!noTrack) {
        core.trackWidgetAction('close', core.openedWidgets[i]);
      }
      core.openedWidgets.splice(i, 1);
      break;
    }
  }

  utils.removeClass(node, 'opened');

  if (utils.hasClass(node, 'pf-has-push-down')) {
    var pushDown = document.querySelector('.pf-push-down');
    if (pushDown) {
      utils.removeClass(pushDown, 'opened');
    }
  }

  // FIXME 500 - magical number
  setTimeout(function () {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }, 500);
}

/** @module config/callbacks */

var callbackTypes = {
  INIT: 'widgetInitialized',
  LOAD: 'widgetLoaded',
  CLICK: 'buttonClicked',
  FORM_SUBMIT: 'formSubmitted',
  MODAL_OPEN: 'modalOpened',
  MODAL_CLOSE: 'modalClosed'
};

/** @module core/construct-widget-actions */

function constructWidgetActions (widget, config) {
  var widgetOnButtonClick, widgetOnFormSubmit,
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetReco = widget.querySelector('.pf-content-unit'),
      core = this;

  var widgetOnModalClose = function (event) {
    if (typeof config.onModalClose === 'function') {
      config.onModalClose(callbackTypes.MODAL_CLOSE, {
        widget: widget,
        config: config,
        event: event
      });
    }
  };

  var updateActionCookie = function (name) {
    var ct,
        val = readCookie(name),
        duration = Date.now();

    if (val) {
      val = val.split('|');
      ct = Math.min(parseInt(val[0], 10), 9998) + 1;
    } else {
      ct = 1;
    }

    saveCookie(name, ct + '|' + duration, core.expiration);
  };

  // Tracking for widgets with a form element
  switch (config.type) {
  case 'form':
  case 'sitegate':
  case 'subscription':
    var widgetForm = widget.querySelector('form');

    var onInputChange = function (event) {
      if (event.target.value && event.target.value.length > 0) {
        trackWidgetAction('form_start', config, event.target);
      }
    };

    var onInputFocus = function (event) {
      trackWidgetAction('focus', config, event.target);
    };

    // Additional tracking for input focus and entering text into the form
    for (var elem in widgetForm.childNodes) {
      if (widgetForm.children.hasOwnProperty(elem)) {
        var child = widgetForm.children[elem];
        if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
          // Track focus of form elements
          child.onfocus = onInputFocus;

          // Track input to indicate they've begun to interact with the form
          child.onchange = onInputChange;
        }
      }
    }

    // Form submit handler
    widgetOnFormSubmit = function (event) {
      var widgetAction;
      event.preventDefault();

      switch (config.type) {
      case 'form':
        widgetAction = 'submit';
        break;
      case 'subscription':
        widgetAction = 'subscribe';
        break;
      case 'sitegate':
        widgetAction = 'unlock';
        break;
      }

      // Validate that the form is filled out correctly
      var valid = true,
          requiredElements = Array.prototype.slice.call(widgetForm.querySelectorAll('[data-required=true]'));

      for (var i = 0; i < requiredElements.length; i++) {
        var field = requiredElements[i];

        if (hasClass(widgetForm, 'pf-custom-form')) {
          if (field.parentNode) {
            var parent = field.parentNode;
            removeClass(parent, 'invalid');

            if (hasClass(parent, 'pf-widget-radio-group') || hasClass(parent, 'pf-widget-checkbox-group')) {
              var inputs = field.querySelectorAll('input');
              var count = 0;

              for (var j = 0; j < inputs.length; j++) {
                var input = inputs[j];
                if (input.checked) {
                  count++;
                }
              }

              if (count === 0) {
                valid = false;
                utils.addClass(parent, 'invalid');
              }
            } else if (!field.value) {
              valid = false;
              utils.addClass(parent, 'invalid');

              if (i === 0) {
                field.focus();
              }
            }
          }
        // legacy support old, non-custom forms
        } else if (field.hasAttribute('data-required')) {
          utils.removeClass(field, 'invalid');

          if (!field.value || (field.getAttribute('type') === 'email' && field.value.indexOf('@') === -1)) {
            valid = false;
            utils.addClass(field, 'invalid');
            if (i === 0) {
              field.focus();
            }
          }
        }
      }

      if (valid && widgetAction) {
        trackWidgetAction(widgetAction, config, widgetForm);

        if (typeof config.onSubmit === 'function') {
          config.onSubmit(callbackTypes.FORM_SUBMIT, {
            widget: widget,
            config: config,
            event: event,
            data: Array.prototype.slice.call(
              widgetForm.querySelectorAll('input, textarea, select')
            ).map(function (element) {
              return {
                name: element.name || element.id,
                value: element.value
              };
            })
          });
        }
        return true;
      }
      return false;
    };

    break;
  }

  switch (config.layout) {
  case 'folding':
    var widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left'),
        widgetFirstCaption = widget.querySelector('.pf-widget-caption');

    if (config.position !== 'left') {
      setTimeout(function () {
        var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
        widget.style.bottom = -height + 'px';
      }, 0);
    }

    for (var i = widgetAllCaptions.length - 1; i >= 0; i--) {
      widgetAllCaptions[i].onclick = function () {
        if (utils.hasClass(widget, 'opened')) {
          utils.removeClass(widget, 'opened');
        } else {
          utils.addClass(widget, 'opened');
        }
      };
    }
    break;

  case 'button':
    if (typeof config.onClick === 'function') {
      widgetOnButtonClick = function (event) {
        config.onClick(callbackTypes.CLICK, {
          widget: widget,
          config: config,
          event: event
        });
      };
    }
    break;

  case 'modal':
  case 'slideout':
  case 'bar':
  case 'inline':
    var widgetCancel = widget.querySelector('.pf-widget-cancel'),
        widgetClose = widget.querySelector('.pf-widget-close');

    if (widgetClose) {
      widgetClose.onmouseenter = function (event) {
        trackWidgetAction('hover', config, event.target);
      };

      widgetClose.onclick = function (event) {
        closeWidget$1(widget.id);
        updateActionCookie(PREFIX_CLOSE + widget.id);

        if (typeof config.closeAction === 'object' && typeof config.closeAction.callback === 'function') {
          config.closeAction.callback(callbackTypes.MODAL_CLOSE, {
            widget: widget,
            config: config,
            event: event
          });
        }

        widgetOnModalClose(event);
      };
    }

    if (widgetCancel) {
      widgetCancel.onmouseenter = function (event) {
        trackWidgetAction('hover', config, event.target);
      };

      if (typeof config.cancelAction === 'object') {
        widgetCancel.onclick = function (event) {
          trackWidgetAction('cancel', config);
          if (typeof config.cancelAction.callback === 'function') {
            config.cancelAction.callback(callbackTypes.MODAL_CANCEL, {
              widget: widget,
              config: config,
              event: event
            });
          }
          updateActionCookie(PREFIX_CANCEL + widget.id);
          closeWidget$1(widget.id, true);
          widgetOnModalClose(event);
        };
      } else {
        widgetCancel.onclick = function (event) {
          trackWidgetAction('cancel', config);
          updateActionCookie(PREFIX_CANCEL + widget.id);
          closeWidget$1(widget.id, true);
          widgetOnModalClose(event);
        };
      }
    }
  default:
    break;
  }

  if (widgetOk) {
    widgetOk.onmouseenter = function (event) {
      core.trackWidgetAction('hover', config, event.target);
    };

    widgetOk.onclick = function (event) {
      if (typeof widgetOnFormSubmit === 'function' && !widgetOnFormSubmit(event)) {
        // invalid form, do not submit
      } else {
        trackWidgetAction('confirm', config);
        updateActionCookie(PREFIX_CONFIRM + widget.id);

        if (typeof config.confirmAction === 'object' && typeof config.confirmAction.callback === 'function') {
          config.confirmAction.callback(callbackTypes.MODAL_CONFIRM, {
            widget: widget,
            config: config,
            event: event
          });
        }
        if (typeof widgetOnButtonClick === 'function') {
          widgetOnButtonClick(event);
        }

        widgetOnModalClose(event);

        if (config.layout !== 'inline' && typeof config.success === 'undefined') {
          closeWidget$1(widget.id, true);

        // show success state
        } else {
          utils.addClass(widget, 'success');

          // default to a three second delay if the user has not defined one
          var delay = typeof config.success.delay !== 'undefined' ? config.success.delay * 1000 : 3000;

          if (delay > 0) {
            setTimeout(function () {
              closeWidget$1(widget.id, true);
            }, delay);
          }
        }
      }
    };
  }


  if (widgetReco) {
    widgetReco.onmouseenter = function (event) {
      trackWidgetAction('hover', config, event.target);
    };

    widgetReco.onclick = function (event) {
      trackWidgetAction('confirm', config, event.target);
      updateActionCookie(PREFIX_CONFIRM + widget.id);
    };
  }
}

/** @module core/setup-widget-content-unit */

function setupWidgetContentUnit (widget, config) {
  var widgetContentUnit = widget.querySelector('.pf-content-unit'),
      settings = config.recommend;

  if (config.recommend && config.content) {
    // Make sure we have content to get
    if (Object.keys(config.content).length > 0) {

      // The top recommendation should be default if we couldn't
      // get one from the api
      var rec = config.content[0],
          recImage = document.createElement('div'),
          recMeta = document.createElement('div'),
          recTitle = document.createElement('h4'),
          recDesc = document.createElement('p'),
          recInfo = document.createElement('span');

      widgetContentUnit.href = rec.url;

      // image div
      if (rec.image && (!settings.display || settings.display.image !== false)) {
        recImage.className = 'pf-content-unit-img';
        recImage.style.backgroundImage = "url('" + rec.image + "')";
        widgetContentUnit.appendChild(recImage);
      }

      recMeta.className = 'pf-content-unit-meta';

      // title h4
      if (rec.title && (!settings.display || settings.display.title !== false)) {
        recTitle.innerHTML = rec.title;
        recMeta.appendChild(recTitle);
      }

      if (rec.author && (settings.display && settings.display.author === true)) {
        recInfo.innerHTML = 'by ' + rec.author;
      }

      if (rec.date && (settings.display && settings.display.date === true)) {
        var published = new Date(rec.date),
            locale = settings.display.locale ? settings.display.locale : context.pathfora.locale,
            dateOptions = settings.display.dateOptions ? settings.display.dateOptions : context.pathfora.dateOptions;


        published = published.toLocaleDateString(locale, dateOptions);

        if (!recInfo.innerHTML) {
          recInfo.innerHTML = published;
        } else {
          recInfo.innerHTML += ' | ' + published;
        }
      }

      if (recInfo.innerHTML) {
        recInfo.className = 'pf-content-unit-info';
        recMeta.appendChild(recInfo);
      }

      // description p
      if (rec.description && (!settings.display || settings.display.description !== false)) {
        var desc = rec.description,
            limit = config.layout === 'modal' ? DEFAULT_CHAR_LIMIT : DEFAULT_CHAR_LIMIT_STACK;


        // set the default character limit for descriptions
        if (!settings.display) {
          settings.display = {
            descriptionLimit: limit
          };
        } else if (!settings.display.descriptionLimit) {
          settings.display.descriptionLimit = limit;
        }

        if (desc.length > settings.display.descriptionLimit && settings.display.descriptionLimit !== -1) {
          desc = desc.substring(0, settings.display.descriptionLimit);
          desc = desc.substring(0, desc.lastIndexOf(' ')) + '...';
        }

        recDesc.innerHTML = desc;
        recMeta.appendChild(recDesc);
      }

      widgetContentUnit.appendChild(recMeta);
    }
  }
}

/** @module core/set-widget-classname */

function setWidgetClassname (widget, config) {
  widget.className = [
    'pf-widget ',
    'pf-' + config.type,
    ' pf-widget-' + config.layout,
    config.position ? ' pf-position-' + config.position : '',
    config.pushDown ? ' pf-has-push-down' : '',
    config.origin ? ' pf-origin-' + config.origin : '',
    ' pf-widget-variant-' + config.variant,
    config.theme ? ' pf-theme-' + config.theme : '',
    config.className ? ' ' + config.className : '',
    config.branding ? ' pf-widget-has-branding' : '',
    !config.responsive ? ' pf-mobile-hide' : ''
  ].join('');
}

/** @module core/build-form-element */

function buildFormElement (elem, form) {
  var content, i, val, label,
      wrapper = document.createElement('div'),
      isGroup = elem.hasOwnProperty('groupType');

  // group elements include: checkbox groups
  if (isGroup) {
    wrapper.className = 'pf-widget-' + elem.type;
    content = document.createElement('div');
  } else {
    content = document.createElement(elem.type);
    content.setAttribute('name', elem.name);
    content.setAttribute('id', elem.name);

    // add row count for textarea
    if (elem.type === 'textarea') {
      content.setAttribute('rows', 5);

    // add text type for input
    } else if (elem.type === 'input') {
      content.setAttribute('type', 'text');
    }
  }

  if (elem.label) {
    if (isGroup) {
      label = document.createElement('span');
    } else {
      label = document.createElement('label');
      label.setAttribute('for', elem.name);
    }

    label.innerHTML = elem.label;
    label.className = 'pf-form-label';
    utils.addClass(content, 'pf-has-label');

    if (elem.required === true) {
      label.innerHTML += ' <span class="required">*</span>';
    }

    wrapper.appendChild(label);
  }

  if (elem.required === true) {
    utils.addClass(wrapper, 'pf-form-required');
    content.setAttribute('data-required', 'true');

    if (elem.label) {
      var reqFlag = document.createElement('div');
      reqFlag.className = 'pf-required-flag';
      reqFlag.innerHTML = 'required';

      var reqTriange = document.createElement('span');
      reqFlag.appendChild(reqTriange);

      wrapper.appendChild(reqFlag);
    }
  }

  if (elem.placeholder) {
    // select element has first option as placeholder
    if (elem.type === 'select') {
      var placeholder = document.createElement('option');
      placeholder.setAttribute('value', '');
      placeholder.innerHTML = elem.placeholder;
      content.appendChild(placeholder);
    } else {
      content.placeholder = elem.placeholder;
    }
  }

  if (elem.values) {
    for (i = 0; i < elem.values.length; i++) {
      val = elem.values[i];

      if (isGroup) {
        var input = document.createElement('input');
        input.setAttribute('type', elem.groupType);
        input.setAttribute('value', val.value);
        input.setAttribute('name', elem.name);

        if (val.label) {
          label = document.createElement('label');
          label.className = 'pf-widget-' + elem.groupType;
          label.appendChild(input);
          label.appendChild(document.createTextNode(val.label));
          content.appendChild(label);
        } else {
          throw new Error(elem.groupType + 'form group values must contain labels');
        }
      } else if (elem.type === 'select') {
        var option = document.createElement('option');
        option.setAttribute('value', val.value);
        option.innerHTML = val.label;

        content.appendChild(option);
      }
    }
  }

  wrapper.appendChild(content);

  // make sure we're inserting the new element before the confirm button
  var btn = form.querySelector('.pf-widget-ok');
  if (btn) {
    form.insertBefore(wrapper, btn);
  } else {
    form.appendChild(wrapper);
  }
}

/** @module core/build-widget-form */

function buildWidgetForm (formElements, form) {
  for (var i = 0; i < formElements.length; i++) {
    var elem = formElements[i];

    switch (elem.type) {
    // Radio & Checkbox Button Group
    case 'radio-group':
    case 'checkbox-group':
      elem.groupType = elem.type.split('-')[0];
      buildFormElement(elem, form);
      delete elem.groupType;
      break;

    // Textarea, Input, & Select
    case 'textarea':
    case 'input':
    case 'select':
      buildFormElement(elem, form);
      break;

    default:
      throw new Error('unrecognized form element type: ' + elem.type);
    }
  }
}

/** @module utils/add-class */

function addClass (DOMNode, className) {
  this.removeClass(DOMNode, className);

  DOMNode.className = [
    DOMNode.className,
    className
  ].join(' ');
}

/** @module config/templates */

var templates$1;

/** @module core/construct-widget-layout */

function constructWidgetLayout (widget, config) {
  var node, child, i,
      widgetContent = widget.querySelector('.pf-widget-content'),
      widgetCancel = widget.querySelector('.pf-widget-cancel'),
      widgetOk = widget.querySelector('.pf-widget-ok'),
      widgetHeadline = widget.querySelectorAll('.pf-widget-headline'),
      widgetBody = widget.querySelector('.pf-widget-body'),
      widgetMessage = widget.querySelector('.pf-widget-message');

  if (widgetCancel !== null && !config.cancelShow) {
    node = widgetCancel;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetOk !== null && !config.okShow) {
    node = widgetOk;

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  if (widgetCancel !== null) {
    widgetCancel.innerHTML = config.cancelMessage;
  }

  if (widgetOk !== null) {
    widgetOk.innerHTML = config.okMessage;
  }

  if (widgetOk && widgetOk.value !== null) {
    widgetOk.value = config.okMessage;
  }

  if (widgetCancel && widgetCancel.value !== null) {
    widgetCancel.value = config.cancelMessage;
  }

  // Form layouts should have a default success message
  switch (config.type) {
  case 'form':
  case 'subscription':
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
    case 'sitegate':
    case 'inline':

      var successTitle = document.createElement('div');
      successTitle.className = 'pf-widget-headline success-state';
      successTitle.innerHTML = config.success && config.success.headline ? config.success.headline : 'Thank you';
      widgetContent.appendChild(successTitle);

      var successMsg = document.createElement('div');
      successMsg.className = 'pf-widget-message success-state';
      successMsg.innerHTML = config.success && config.success.msg ? config.success.msg : 'We have received your submission.';
      widgetContent.appendChild(successMsg);

      break;
    }
    break;
  }

  switch (config.layout) {
  case 'modal':
  case 'slideout':
  case 'sitegate':
  case 'inline':
    if (widgetContent && config.branding) {
      var branding = document.createElement('div');
      branding.className = 'branding';
      branding.innerHTML = templates$1.assets.lytics;
      widgetContent.appendChild(branding);
    }

    break;
  }

  switch (config.type) {
  case 'form':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'subscription':
    switch (config.layout) {
    case 'folding':
    case 'modal':
    case 'bar':
    case 'slideout':
    case 'random':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'message':
    switch (config.layout) {
    case 'modal':
    case 'slideout':
      break;
    case 'random':
    case 'bar':
    case 'button':
    case 'inline':
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  case 'sitegate':
    switch (config.layout) {
    case 'modal':
      if (config.showForm === false) {
        node = widget.querySelector('form');
        child = node.querySelectorAll('input, select, textarea');

        if (node) {
          for (i = 0; i < child.length; i++) {
            node.removeChild(child[i]);
          }

          child = node.querySelector('.pf-sitegate-clear');

          if (child) {
            node.removeChild(child);
          }
        }
      }
      break;
    default:
      throw new Error('Invalid widget layout value');
    }
    break;
  }

  // NOTE Set The headline
  for (i = widgetHeadline.length - 1; i >= 0; i--) {
    widgetHeadline[i].innerHTML = config.headline;
  }

  // NOTE Set the image
  if (config.image) {
    if (config.layout === 'button') {
      // NOTE Images are not compatible with the button layout
    } else {
      var widgetImage = document.createElement('img');
      widgetImage.src = config.image;
      widgetImage.className = 'pf-widget-img';
      widgetBody.appendChild(widgetImage);
    }
  }

  switch (config.type) {
  case 'sitegate':
  case 'form':
    if (config.showSocialLogin === false) {
      node = widget.querySelector('.pf-social-login');

      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    // Check if custom form is defined
    if (config.formElements && config.formElements.length) {
      // remove the existing form fields
      var form = widget.querySelector('form');
      addClass(form, 'pf-custom-form');
      var childName;
      var arr = form.children;

      for (var k = 0; k < arr.length; k++) {
        child = arr[k];

        if (typeof child.getAttribute !== 'undefined') {
          childName = child.getAttribute('name');

          if (childName != null) {
            form.removeChild(child);
            k--;
          }
        }
      }

      buildWidgetForm(config.formElements, form);

    } else {
      // suport old form functions
      var getFormElement = function (field) {
        if (field === 'name') {
          return widget.querySelector('input[name="username"]');
        }

        return widget.querySelector('form [name="' + field + '"]');
      };

      // Set placeholders
      Object.keys(config.placeholders).forEach(function (field) {
        var element = getFormElement(field);

        if (element && typeof element.placeholder !== 'undefined') {
          element.placeholder = config.placeholders[field];
        } else if (element && typeof element.options !== 'undefined') {
          element.options[0].innerHTML = config.placeholders[field];
        }
      });

      // Set required Fields
      Object.keys(config.required).forEach(function (field) {
        var element = getFormElement(field);

        if (element && config.required[field]) {
          element.setAttribute('data-required', 'true');
        }
      });

      // Hide fields
      Object.keys(config.fields).forEach(function (field) {
        var element = getFormElement(field);

        if (element && !config.fields[field] && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });

      // NOTE: collapse half-width inputs
      Array.prototype.slice.call(widget.querySelectorAll('form .pf-field-half-width')).forEach(function (element, halfcount) {
        var parent = element.parentNode,
            prev = element.previousElementSibling,
            next = element.nextElementSibling;

        if (parent) {
          if (element.className.indexOf('pf-field-half-width') !== -1) {

            if (halfcount % 2) { // odd
              addClass(element, 'right');

              if (!(prev && prev.className.indexOf('pf-field-half-width') !== -1)) {
                removeClass(element, 'pf-field-half-width');
              }

            } else if (!(next && next.className.indexOf('pf-field-half-width') !== -1)) { // even
              removeClass(element, 'pf-field-half-width');
            }
          }
        }
      });
    }

    // For select boxes we need to control the color of
    // the placeholder text
    var selects = widget.querySelectorAll('select');

    for (i = 0; i < selects.length; i++) {
      // default class indicates the placeholder text color
      if (selects[i].value === '') {
        addClass(selects[i], 'default');
      }

      selects[i].onchange = function () {
        if (this.value !== '') {
          removeClass(this, 'default');
        } else {
          addClass(this, 'default');
        }
      };
    }

    break;
  case 'subscription':
    widget.querySelector('input').placeholder = config.placeholders.email;
    break;
  }

  if (config.msg) {
    widgetMessage.innerHTML = config.msg;
  }
}

/** @module core/set-custom-colors*/

function setCustomColors (widget, colors) {
  var i = 0,
      close = widget.querySelector('.pf-widget-close'),
      msg = widget.querySelectorAll('.pf-widget-message'),
      headline = widget.querySelectorAll('.pf-widget-headline'),
      headlineLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-headline'),
      cancelBtn = widget.querySelector('.pf-widget-btn.pf-widget-cancel'),
      okBtn = widget.querySelector('.pf-widget-btn.pf-widget-ok'),
      arrow = widget.querySelector('.pf-widget-caption span'),
      arrowLeft = widget.querySelector('.pf-widget-caption-left span'),
      contentUnit = widget.querySelector('.pf-content-unit'),
      contentUnitMeta = widget.querySelector('.pf-content-unit-meta'),
      fields = widget.querySelectorAll('input, textarea, select'),
      branding = widget.querySelector('.branding svg'),
      required = widget.querySelectorAll('.pf-required-flag'),
      requiredAsterisk = widget.querySelectorAll('span.required'),
      requiredInline = widget.querySelectorAll('[data-required=true]:not(.pf-has-label)'),
      socialBtns = Array.prototype.slice.call(widget.querySelectorAll('.social-login-btn'));

  if (colors.background) {
    if (utils.hasClass(widget, 'pf-widget-modal')) {
      widget.querySelector('.pf-widget-content').style.setProperty('background-color', colors.background, 'important');
    } else {
      widget.style.setProperty('background-color', colors.background, 'important');
    }
  }

  if (colors.fieldBackground) {
    for (i = 0; i < fields.length; i++) {
      fields[i].style.setProperty('background-color', colors.fieldBackground, 'important');
    }
  }

  if (colors.required) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('background-color', colors.required, 'important');
      required[i].querySelector('span').style.setProperty('border-right-color', colors.required, 'important');
    }

    for (i = 0; i < requiredInline.length; i++) {
      requiredInline[i].style.setProperty('border-color', colors.required, 'important');
    }

    for (i = 0; i < requiredAsterisk.length; i++) {
      requiredAsterisk[i].style.setProperty('color', colors.required, 'important');
    }
  }

  if (colors.requiredText) {
    for (i = 0; i < required.length; i++) {
      required[i].style.setProperty('color', colors.requiredText, 'important');
    }
  }

  if (contentUnit && contentUnitMeta) {
    if (colors.actionBackground) {
      contentUnit.style.setProperty('background-color', colors.actionBackground, 'important');
    }

    if (colors.actionText) {
      contentUnitMeta.querySelector('h4').style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.text) {
      contentUnitMeta.querySelector('p').style.setProperty('color', colors.text, 'important');
    }
  }

  if (close && colors.close) {
    close.style.setProperty('color', colors.close, 'important');
  }

  if (headline && colors.headline) {
    for (i = 0; i < headline.length; i++) {
      headline[i].style.setProperty('color', colors.headline, 'important');
    }
  }

  if (headlineLeft && colors.headline) {
    headlineLeft.style.setProperty('color', colors.headline, 'important');
  }

  if (arrow && colors.close) {
    arrow.style.setProperty('color', colors.close, 'important');
  }

  if (arrowLeft && colors.close) {
    arrowLeft.style.setProperty('color', colors.close, 'important');
  }

  if (cancelBtn) {
    if (colors.cancelText) {
      cancelBtn.style.setProperty('color', colors.cancelText, 'important');
    }

    if (colors.cancelBackground) {
      cancelBtn.style.setProperty('background-color', colors.cancelBackground, 'important');
    }
  }

  if (okBtn) {
    if (colors.actionText) {
      okBtn.style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.actionBackground) {
      okBtn.style.setProperty('background-color', colors.actionBackground, 'important');
    }
  }

  if (colors.text && branding) {
    branding.style.setProperty('fill', colors.text, 'important');
  }


  socialBtns.forEach(function (btn) {
    if (colors.actionText) {
      btn.style.setProperty('color', colors.actionText, 'important');
    }

    if (colors.actionBackground) {
      btn.style.setProperty('background-color', colors.actionBackground, 'important');
    }
  });

  if (msg && colors.text) {
    for (i = 0; i < msg.length; i++) {
      msg[i].style.setProperty('color', colors.text, 'important');
    }
  }
}

/** @module config/default-props */

var defaultProps$1 = {
  generic: {
    className: 'pathfora',
    branding: true,
    responsive: true,
    headline: '',
    themes: {
      dark: {
        background: '#333',
        headline: '#fefefe',
        text: '#aaa',
        close: '#888',
        actionText: '#fff',
        actionBackground: '#444',
        cancelText: '#888',
        cancelBackground: '#333'
      },
      light: {
        background: '#f1f1f1',
        headline: '#444',
        text: '#888',
        close: '#bbb',
        actionText: '#444',
        actionBackground: '#fff',
        cancelText: '#bbb',
        cancelBackground: '#f1f1f1'
      }
    },
    displayConditions: {
      showOnInit: true,
      showOnExitIntent: false,
      showDelay: 0,
      hideAfter: 0,
      displayWhenElementVisible: '',
      scrollPercentageToDisplay: 0
    }
  },
  message: {
    layout: 'modal',
    position: '',
    variant: '1',
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  },
  subscription: {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      email: 'Email'
    },
    okMessage: 'Confirm',
    cancelMessage: 'Cancel',
    okShow: true,
    cancelShow: true
  },
  form: {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      company: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Send',
    okShow: true,
    cancelMessage: 'Cancel',
    cancelShow: true,
    showSocialLogin: false
  },
  sitegate: {
    layout: 'modal',
    position: '',
    variant: '1',
    placeholders: {
      name: 'Name',
      title: 'Title',
      email: 'Email',
      message: 'Message',
      company: 'Company',
      phone: 'Phone Number',
      country: 'Country',
      referralEmail: 'Referral Email'
    },
    required: {
      name: true,
      email: true
    },
    fields: {
      message: false,
      phone: false,
      country: false,
      referralEmail: false
    },
    okMessage: 'Submit',
    okShow: true,
    cancelShow: false,
    showSocialLogin: false,
    showForm: true
  }
};

/** @module core/setup-widget-colors */

function setupWidgetColors (widget, config) {
  switch (config.theme) {
  case 'custom':
    if (config.colors) {
      csetCustomColors(widget, config.colors);
    }
    break;
  case 'none':
    // Do nothing, we will rely on CSS for the colors
    break;
  default:
    if (config.theme) {
      setCustomColors(widget, defaultProps$1.generic.themes[config.theme]);
    }
    break;
  }
}

/** @module core/create-widget-html */

function createWidgetHtml (config) {
  var widget = document.createElement('div');

  widget.innerHTML = templates[config.type][config.layout] || '';
  widget.id = config.id;

  if (widget.innerHTML === '') {
    throw new Error('Could not get pathfora template based on type and layout.');
  }

  setupWidgetPosition(widget, config);
  constructWidgetActions(widget, config);
  setupWidgetContentUnit(widget, config);
  setWidgetClassname(widget, config);
  constructWidgetLayout(widget, config);
  setupWidgetColors(widget, config);

  return widget;
}

/** @module core/widget-resize-listener */

function widgetResizeListener (widget, node) {
  if (widget.layout === 'inline' || widget.layout === 'modal' && widget.recommend) {
    var rec = node.querySelector('.pf-content-unit');
    if (rec) {
      if (node.offsetWidth < WIDTH_BREAKPOINT && !utils.hasClass(rec, 'stack')) {
        addClass(rec, 'stack');
      } else if (node.offsetWidth >= WIDTH_BREAKPOINT) {
        addClass(rec, 'stack');
      }
    }
  }
}

/** @module pathfora/widgets/show-widget */

function showWidget () {
  // FIXME Change to Array#filter and Array#length
  for (var i = 0; i < core.openedWidgets.length; i++) {
    if (core.openedWidgets[i] === widget) {
      return;
    }
  }

  openedWidgets.push(widget);
  trackWidgetAction('show', widget);

  if (widget.displayConditions.impressions) {
    incrementImpressions(widget);
  }

  var node = createWidgetHtml(widget);

  if (widget.showSocialLogin) {
    if (widget.showForm === false) {
      core.openedWidgets.pop();
      throw new Error('Social login requires a form on the widget');
    }
  }

  if (widget.pushDown) {
    utils.addClass(document.querySelector('.pf-push-down'), 'opened');
  }

  if (widget.config.layout !== 'inline') {
    document.body.appendChild(node);
  } else {
    var hostNode = document.querySelector(widget.config.position);

    if (hostNode) {
      hostNode.appendChild(node);
    } else {
      core.openedWidgets.pop();
      throw new Error('Inline widget could not be initialized in ' + widget.config.position);
    }
  }

  // NOTE wait for appending to DOM to trigger the animation
  // FIXME 50 - magical number
  setTimeout(function () {
    var widgetLoadCallback = widget.config.onLoad;

    addClass(node, 'opened');

    if (typeof widgetLoadCallback === 'function') {
      widgetLoadCallback(callbackTypes.LOAD, {
        widget: widget,
        node: node
      });
    }
    if (widget.config.layout === 'modal' && typeof widget.config.onModalOpen === 'function') {
      widget.config.onModalOpen(callbackTypes.MODAL_OPEN, {
        widget: widget
      });
    }
  }, 50);


  if (widget.displayConditions.hideAfter) {
    setTimeout(function () {
      context.pathfora.closeWidget(widget.id, true);
    }, widget.displayConditions.hideAfter * 1000);
  }

  widgetResizeListener(widget, node);

  if (typeof context.addEventListener === 'function') {
    context.addEventListener('resize', function () {
      widgetResizeListener(widget, node);
    });
  }
}

/** @module core/init-widget */

function initializeWidget (widget) {
  var watcher,
      condition = widget.displayConditions,
      core = this;

  widget.watchers = [];

  // NOTE Default cookie expiration is one year from now
  this.expiration = new Date();
  this.expiration.setDate(this.expiration.getDate() + 365);

  if (widget.pushDown) {
    if (widget.layout === 'bar' && (widget.position === 'top-fixed' || widget.position === 'top-absolute')) {
      utils.addClass(document.querySelector(widget.pushDown), 'pf-push-down');
    } else {
      throw new Error('Only top positioned bar widgets may have a pushDown property');
    }
  }

  var evalDisplayConditions = function () {
    // display conditions based on page load
    if (condition.date) {
      widget.valid = widget.valid && dateChecker(condition.date);
    }

    if (condition.pageVisits) {
      widget.valid = widget.valid && pageVisitsChecker(condition.pageVisits);
    }

    if (condition.hideAfterAction) {
      widget.valid = widget.valid && hideAfterActionChecker(condition.hideAfterAction, widget);
    }
    if (condition.urlContains) {
      widget.valid = widget.valid && urlChecker(condition.urlContains);
    }

    widget.valid = widget.valid && condition.showOnInit;

    if (condition.impressions) {
      widget.valid = widget.valid && impressionsChecker(condition.impressions, widget);
    }

    if (typeof condition.priority !== 'undefined' && widget.valid && core.prioritizedWidgets.indexOf(widget) === -1) {
      core.prioritizedWidgets.push(widget);
      return;
    }

    // display conditions based on page interaction
    if (condition.showOnExitIntent) {
      initializeExitIntent(widget);
    }

    if (condition.displayWhenElementVisible) {
      watcher = registerElementWatcher(condition.displayWhenElementVisible, widget);
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.scrollPercentageToDisplay) {
      watcher = registerPositionWatcher(condition.scrollPercentageToDisplay, widget);
      widget.watchers.push(watcher);
      initializeScrollWatchers(widget);
    }

    if (condition.manualTrigger) {
      watcher = core.registerManualTriggerWatcher(condition.manualTrigger, widget);
      widget.watchers.push(watcher);
      core.readyWidgets.push(widget);

      // if we've already triggered the widget
      // before initializing lets initialize right away
      core.triggerWidget(widget);
    }

    if (widget.watchers.length === 0 && !condition.showOnExitIntent) {
      if (widget.valid) {
        showWidget(widget);
      }
    }
  };

  var regex = /\{{2}.*?\}{2}/g;
  var foundMsg, foundHeadline, foundImage;

  if (typeof widget.msg === 'string') {
    foundMsg = widget.msg.match(regex);
  }

  if (typeof widget.headline === 'string') {
    foundHeadline = widget.headline.match(regex);
  }


  if (typeof widget.image === 'string') {
    foundImage = widget.image.match(regex);
  }

  if ((foundMsg && foundMsg.length > 0) || (foundHeadline && foundHeadline.length > 0) || (foundImage && foundImage.length > 0)) {
    addCallback(function () {
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'msg', foundMsg);
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'headline', foundHeadline);
      widget.valid = widget.valid && core.entityFieldChecker(widget, 'image', foundImage);
      evalDisplayConditions();
    });
  } else {
    evalDisplayConditions();
  }
}

/** @module core/register-delayed-widget */

function registerDelayedWidget (widget) {
  this.delayedWidgets[widget.id] = setTimeout(function () {
     initializeWidget(widget);
  }, widget.displayConditions.showDelay * 1000);
}

/** @module utils/update-object */

function updateObject (object, config) {
  for (var prop in config) {
    if (config.hasOwnProperty(prop) && typeof config[prop] === 'object' && config[prop] !== null && !Array.isArray(config[prop])) {
      if (config.hasOwnProperty(prop)) {
        if (typeof object[prop] === 'undefined') {
          object[prop] = {};
        }
        core.updateObject(object[prop], config[prop]);
      }
    } else if (config.hasOwnProperty(prop)) {
      object[prop] = config[prop];
    }
  }
}

/** @module utils/construct-queries */

function constructQueries (params) {
  var count = 0,
      queries = [];

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      if (count !== 0) {
        queries.push('&');
      } else {
        queries.push('?');
      }

      if (params[key] instanceof Object) {
        // multiple params []string (topics or rollups)
        for (var i in params[key]) {
          if (i < Object.keys(params[key]).length && i > 0) {
            queries.push('&');
          }

          queries.push(key + '[]=' + params[key][i]);
        }

      // single param
      } else {
        queries.push(key + '=' + params[key]);
      }

      count++;
    }
  }

  return queries.join('');
}

/** @module api/recommend/recommend-content */

function recommendContent (accountId, params, id, callback) {
  // Recommendation API:
  // https://www.getlytics.com/developers/rest-api#content-recommendation

  // if we have the recommendation response cached in session storage
  // use that instead of making a new API request
  var storedRec = sessionStorage.getItem(PREFIX_REC + id);

  if (typeof storedRec === 'string' && params.visited !== false) {
    var rec;

    try {
      rec = JSON.parse(storedRec);
    } catch (e) {
      console.warn('Could not parse json stored response:' + e);
    }

    if (rec && rec.data) {
      // special case: shuffle param
      if (params.shuffle === true) {
        rec.data.shift();
      }

      if (rec.data.length > 0) {
        sessionStorage.setItem(PREFIX_REC + id, JSON.stringify(rec.data));
        callback(rec.data);
      }
      return;
    }
  }

  var seerId = readCookie('seerid');

  if (!seerId) {
    throw new Error('Cannot find SEERID cookie');
  }

  var recommendParts = [
    '{{apiurl}}/api/content/recommend/',
    accountId,
    '/user/_uids/',
    seerId
  ];


  var ql = params.ql,
      ast = params.ast,
      display = params.display;

  delete params.ql;
  delete params.ast;
  delete params.display;

  var queries = constructQueries(params);

  params.display = display;

  if (!params.contentsegment) {
    // Special case for Adhoc Segments
    if (ql && ql.raw || ast) {
      if (queries.length > 0) {
        queries += '&';
      } else {
        queries += '?';
      }

      // Filter QL
      if (ql && ql.raw) {
        queries += 'ql=' + ql.raw;

      // Segment JSON (usually segment AST)
      } else {
        var contentSegment = {table: 'content', ast: ast};
        queries += 'contentsegments=[' + encodeURIComponent(JSON.stringify(contentSegment)) + ']';
      }
    }
  }

  var recommendUrl = recommendParts.join('') + queries;

  this.getData(recommendUrl, function (json) {

    // set the session storage.
    sessionStorage.setItem(PREFIX_REC + id, json);
    var resp;

    try {
      resp = JSON.parse(json);
    } catch (e) {
      console.warn('Could not parse json response:' + e);
      callback([]);
      return;
    }

    if (resp.data && resp.data.length > 0) {
      // append a protocol for urls that are absolute
      for (var i = 0; i < resp.data.length; i++) {
        var url = resp.data[i].url;
        if (url) {
          var split = url.split('/')[0].split('.');
          if (split.length > 1) {
            resp.data[i].url = 'http://' + url;
          }
        }
      }

      callback(resp.data);
    } else {
      callback([]);
    }
  }, function () {
    callback([]);
  });
}

/** @module core/initialize-widget-array */

function initializeWidgetArray (array) {
  var displayWidget = function (w) {
    if (w.displayConditions.showDelay) {
      registerDelayedWidget(w);
    } else {
      initializeWidget(w);
    }
  };

  var recContent = function (w, params) {
    addCallback(function () {
      if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
        if (context.lio && context.lio.account) {
          pathfora.acctid = context.lio.account.id;
        } else {
          throw new Error('Could not get account id from Lytics Javascript tag.');
        }
      }

      recommendContent(pathfora.acctid, params, w.id, function (resp) {
        // if we get a response from the recommend api put it as the first
        // element in the content object this replaces any default content
        if (resp[0]) {
          var content = resp[0];
          w.content = [
            {
              title: content.title,
              description: content.description,
              url: content.url,
              image: content.primary_image,
              date: content.created,
              author: content.author
            }
          ];
        }

        // if we didn't get a valid response from the api, we check if a default
        // exists and use that as our content piece instead
        if (!w.content) {
          throw new Error('Could not get recommendation and no default defined');
        }

        displayWidget(w);
      });
    });
  };

  for (var i = 0; i < array.length; i++) {
    var widget = array[i];

    if (!widget || !widget.config) {
      continue;
    }

    var widgetOnInitCallback = widget.config.onInit,
        defaults = defaultProps$1[widget.type],
        globals = defaultProps$1.generic;

    if (widget.type === 'sitegate' && readCookie(PREFIX_UNLOCK + widget.id) === 'true' || widget.hiddenViaABTests === true) {
      continue;
    }

    if (this.initializedWidgets.indexOf(widget.id) < 0) {
      this.initializedWidgets.push(widget.id);
    } else {
      throw new Error('Cannot add two widgets with the same id');
    }

    updateObject(widget, globals);
    updateObject(widget, defaults);
    updateObject(widget, widget.config);

    if (widget.type === 'message' && (widget.recommend && Object.keys(widget.recommend).length !== 0) || (widget.content && widget.content.length !== 0)) {
      if (widget.layout !== 'slideout' && widget.layout !== 'modal' && widget.layout !== 'inline') {
        throw new Error('Unsupported layout for content recommendation');
      }

      if (widget.content && widget.content[0] && !widget.content[0].default) {
        throw new Error('Cannot define recommended content unless it is a default');
      }

      var params = widget.recommend;

      if (widget.recommend.collection) {
        params.contentsegment = widget.recommend.collection;
        delete params.collection;
      }

      recContent(widget, params);

    } else {
      displayWidget(widget);
    }

    // NOTE onInit feels better here
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: widget
      });
    }
  }
}

/** @module api/segments/get-user-segments */

function getUserSegments () {
  if (context.lio && context.lio.data && context.lio.data.segments) {
    return context.lio.data.segments;
  } else {
    return ['all'];
  }
}

/** @module pathfora/widgets/init-widgets */

function initializeWidgets (widgets, config) {
  // NOTE IE < 10 not supported
  // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
  if (document.all && !window.atob) {
    return;
  }

  // support legacy initialize function where we passed account id as
  // a second parameter and config as third
  if (arguments.length >= 3) {
    config = arguments[2];
  // if the second param is an account id, we need to throw it out
  } else if (typeof config === 'string') {
    config = null;
  }

  validateWidgetsObject(widgets);
  trackTimeOnPage();

  if (config) {
    originalConf = JSON.parse(JSON.stringify(defaultProps$1));
    updateObject(defaultProps$1, config);
  }

  if (widgets instanceof Array) {

    // NOTE Simple initialization
    initializeWidgetArray(widgets);
  } else {

    // NOTE Target sensitive widgets
    if (widgets.common) {
      initializeWidgetArray(widgets.common);
      updateObject(defaultProps$1, widgets.common.config);
    }

    if (widgets.target || widgets.exclude) {
      // Add callback to initialize once we know segments are loaded
      this.addCallback(function () {
        var target, ti, tl, exclude, ei, ex, ey, el,
            targetedwidgets = [],
            excludematched = false,
            segments = getUserSegments();

        // handle inclusions
        if (widgets.target) {
          tl = widgets.target.length;
          for (ti = 0; ti < tl; ti++) {
            target = widgets.target[ti];
            if (segments && segments.indexOf(target.segment) !== -1) {
              // add the widgets with proper targeting to the master list
              // ensure we dont overwrite existing widgets in target
              targetedwidgets = targetedwidgets.concat(target.widgets);
            }
          }
        }

        // handle exclusions
        if (widgets.exclude) {
          el = widgets.exclude.length;
          for (ei = 0; ei < el; ei++) {
            exclude = widgets.exclude[ei];
            if (segments && segments.indexOf(exclude.segment) !== -1) {
              // we found a match, ensure the corresponding segment(s) are not in the
              // targetted widgets array
              for (ex = 0; ex < targetedwidgets.length; ex++) {
                for (ey = 0; ey < exclude.widgets.length; ey++) {
                  if (targetedwidgets[ex] === exclude.widgets[ey]) {
                    targetedwidgets.splice(ex, 1);
                  }
                }
              }
            }
          }
        }

        if (targetedwidgets.length) {
          initializeWidgetArray(targetedwidgets);
        }

        if (!targetedwidgets.length && !excludematched && widgets.inverse) {
          initializeWidgetArray(widgets.inverse);
        }
      });
    }
  }
}

/** @module utils/generate-unique-id */

function generateUniqueId () {
  var s4;

  if (typeof s4 === 'undefined') {
    s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
  }

  return [
    s4(), s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(),
    '-',
    s4(), s4(), s4()
  ].join('');
}

/** @module pathfora/preview-widget */

function previewWidget (widget) {
  widget.id = generateUniqueId();
  return core.createWidgetHtml(widget);
}

/** @module pathfora/widgets/clear-all */

function clearAll () {
  var opened = core.openedWidgets,
      delayed = core.delayedWidgets;

  opened.forEach(function (widget) {
    var element = document.getElementById(widget.id);
    utils.removeClass(element, 'opened');
    element.parentNode.removeChild(element);
  });

  opened.slice(0);

  for (var i = delayed.length; i > -1; i--) {
    core.cancelDelayedWidget(delayed[i]);
  }

  core.openedWidgets = [];
  core.initializedWidgets = [];

  pathforaDataObject = {
    pageViews: 0,
    timeSpentOnPage: 0,
    closedWidgets: [],
    completedActions: [],
    cancelledActions: [],
    displayedWidgets: [],
    abTestingGroups: [],
    socialNetworks: {}
  };

  if (originalConf) {
    defaultProps = originalConf;
  }
}

/** @module pathfora/widgets/reinit-prioritized-widgets */

function reinitializePrioritizedWidgets() {
  if (core.prioritizedWidgets.length > 0) {

    core.prioritizedWidgets.sort(function (a, b) {
      return a.displayConditions.priority - b.displayConditions.priority;
    }).reverse();

    var highest = core.prioritizedWidgets[0].displayConditions.priority;

    for (var j = 0; j < core.prioritizedWidgets.length; j++) {
      if (core.prioritizedWidgets[j].displayConditions.priority === highest) {
        core.initializeWidget(core.prioritizedWidgets[j]);
      } else {
        break;
      }
    }
  }
}

/** @module core/prepare-widget */

function prepareWidget (type, config) {
  var props, random,
      widget = {
        valid: true
      };

  if (!config) {
    throw new Error('Config object is missing');
  }

  if (config.layout === 'random') {
    props = {
      layout: ['modal', 'slideout', 'bar', 'folding'],
      variant: ['1', '2'],
      slideout: ['bottom-left', 'bottom-right'],
      bar: ['top-absolute', 'top-fixed', 'bottom-fixed'],
      folding: ['left', 'bottom-left', 'bottom-right']
    };

    // FIXME Hard coded magical numbers, hard coded magical numbers everywhere :))
    switch (type) {
    case 'message':
      random = Math.floor(Math.random() * 4);
      config.layout = props.layout[random];
      break;
    case 'subscription':
      random = Math.floor(Math.random() * 5);
      while (random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
      break;
    case 'form':
      random = Math.floor(Math.random() * 5);
      while (random === 2 || random === 3) {
        random = Math.floor(Math.random() * 5);
      }
      config.layout = props.layout[random];
    }
    switch (config.layout) {
    case 'folding':
      config.position = props.folding[Math.floor(Math.random() * 3)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'slideout':
      config.position = props.slideout[Math.floor(Math.random() * 2)];
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      break;
    case 'modal':
      config.variant = props.variant[Math.floor(Math.random() * 2)];
      config.position = '';
      break;
    case 'bar':
      config.position = props.bar[Math.floor(Math.random() * 3)];
      break;
    case 'inline':
      config.position = 'body';
      break;
    }
  }
  widget.type = type;
  widget.config = config;

  if (!config.id) {
    throw new Error('All widgets must have an id value');
  }

  widget.id = config.id;

  return widget;
}

/** @module pathfora/widgets/message */

function Message (config) {
  return prepareWidget('message', config);
}

/** @module pathfora/widgets/subscription */

function Subscription (config) {
  return prepareWidget('subscription', config);
}

/** @module pathfora/widgets/form */

function Form (config) {
  return core.prepareWidget('form', config);
}

/** @module pathfora/widgets/gate */

function SiteGate (config) {
  return core.prepareWidget('sitegate', config);
}

/** @module pathfora/inline/prep-elements */

function prepElements (attr) {
  var dataElements = {},
      elements = document.querySelectorAll('[' + attr + ']');

  this.elements = this.elements.concat(elements);

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(attr) !== null) {
      var theElement = elements[i];

      switch (attr) {
      // CASE: Segment triggered elements
      case 'data-pftrigger':
        var group = theElement.getAttribute('data-pfgroup');

        if (!group) {
          group = 'default';
        }

        if (!dataElements[group]) {
          dataElements[group] = [];
        }

        dataElements[group].push({
          elem: theElement,
          displayType: theElement.style.display,
          group: group,
          trigger: theElement.getAttribute('data-pftrigger')
        });
        break;

      // CASE: Content recommendation elements
      case 'data-pfrecommend':
        var recommend = theElement.getAttribute('data-pfrecommend'),
            block = theElement.getAttribute('data-pfblock');

        if (!block) {
          block = 'default';
        }

        if (!recommend) {
          recommend = 'default';
        }

        if (!dataElements[recommend]) {
          dataElements[recommend] = [];
        }

        dataElements[recommend][block] = {
          elem: theElement,
          displayType: theElement.style.display,
          block: block,
          recommend: recommend,
          title: theElement.querySelector('[data-pftype="title"]'),
          image: theElement.querySelector('[data-pftype="image"]'),
          description: theElement.querySelector('[data-pftype="description"]'),
          url: theElement.querySelector('[data-pftype="url"]'),
          published: theElement.querySelector('[data-pftype="published"]'),
          author: theElement.querySelector('[data-pftype="author"]')
        };
        break;
      }
    }
  }
  return dataElements;
}

/** @module pathfora/proc-recommend-elements */

function procRecommendElements (blocks, rec, cb) {
  var inline = this;

  if (rec !== 'default') {
    // call the recommendation API using the url pattern urlPattern as a filter
    var params = {
      contentsegment: rec
    };

    recommendContent(pathfora.acctid, params, rec, function (resp) {
      var idx = 0;
      for (var block in blocks) {
        if (blocks.hasOwnProperty(block)) {
          var elems = blocks[block];

          // loop through the results as we loop
          // through each element with a common liorecommend value
          if (resp[idx]) {
            var content = resp[idx];

            if (elems.title) {
              elems.title.innerHTML = content.title;
            }

            // if attribute is on image element
            if (elems.image) {
              if (typeof elems.image.src !== 'undefined') {
                elems.image.src = content.primary_image;
              // if attribute is on container element, set the background
              } else {
                elems.image.style.backgroundImage = 'url("' + content.primary_image + '")';
              }
            }

            // set the description
            if (elems.description) {
              elems.description.innerHTML = content.description;
            }

            // if attribute is on an a (link) element
            if (elems.url) {
              if (typeof elems.url.href !== 'undefined') {
                elems.url.href = content.url;
              // if attribute is on container element
              } else {
                elems.url.innerHTML = content.url;
              }
            }

            // set the date published
            if (elems.published && content.created) {
              var published = new Date(content.created);
              elems.published.innerHTML = published.toLocaleDateString(pathfora.locale, pathfora.dateOptions);
            }

            // set the author
            if (elems.author) {
              elems.author.innerHTML = content.author;
            }

            elems.elem.removeAttribute('data-pfrecommend');
            elems.elem.setAttribute('data-pfmodified', 'true');
            inline.preppedElements[block] = elems;
          } else {
            break;
          }
          idx++;
        }
      }
      cb();
    });
  } else {
    for (var block in blocks) {
      if (blocks.hasOwnProperty(block)) {
        inline.defaultElements[block] = blocks[block];
      }
    }
    cb();
  }
}

/** @module pathfora/inline/set-default-recommend */

function setDefaultRecommend () {
  // check the default elements
  for (var block in this.defaultElements) {
    // If we already have an element prepped for this block, don't show the default
    if (this.defaultElements.hasOwnProperty(block) && !this.preppedElements.hasOwnProperty(block)) {
      var def = this.defaultElements[block];
      def.elem.removeAttribute('data-pfrecommend');
      def.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[block] = def;
    }
  }
}

/** @module api/segments/in-segment */

function inSegment (match) {
  return (getUserSegments().indexOf(match) !== -1);
}

/** @module pathfora/inline/proc-trigger-elements */

function procTriggerElements (elems, group) {
  var matched = false,
      defaultEl = {};

  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    // if we find a match show that and prevent others from showing in same group
    if (inSegment(elem.trigger) && !matched) {
      elem.elem.removeAttribute('data-pftrigger');
      elem.elem.setAttribute('data-pfmodified', 'true');
      this.preppedElements[group] = elem;

      if (group !== 'default') {
        matched = true;
        continue;
      }
    }

    // if this is the default save it
    if (elem.trigger === 'default') {
      defaultEl = elem;
    }
  }

  // if nothing matched show default
  if (!matched && group !== 'default' && defaultEl.elem) {
    defaultEl.elem.removeAttribute('data-pftrigger');
    defaultEl.elem.setAttribute('data-pfmodified', 'true');
    this.preppedElements[group] = defaultEl;
  }
}

/** @module pathfora/inline/proc-elements */

function procElements () {
  var attrs = ['data-pftrigger', 'data-pfrecommend'],
      inline = this,
      count = 0;

  var cb = function (elements) {
    count++;
    // After we have processed all elements, proc defaults
    if (count === Object.keys(elements).length) {
      setDefaultRecommend(elements);
    }
  };

  attrs.forEach(function (attr) {
    var elements = prepElements(attr);

    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {

        switch (attr) {
        // CASE: Segment triggered elements
        case 'data-pftrigger':
          procTriggerElements(elements[key], key);
          break;

        // CASE: Content recommendation elements
        case 'data-pfrecommend':
          if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
            throw new Error('Could not get account id from Lytics Javascript tag.');
          }

          procRecommendElements(elements[key], key, function () {
            cb(elements);
          });
          break;
        }
      }
    }
  });
}

/** @module pathfora/inline */

function Inline (pathfora) {
  this.elements = [];
  this.preppedElements = [];
  this.defaultElements = [];

  this.prepElements = prepElements;
  this.procElements = procElements;
  this.procRecommendElements = procRecommendElements;
  this.procTriggerElements = procTriggerElements;
  this.setDefaultRecommend = setDefaultRecommend;

  // for our automatic element handling we need to ensure they are all hidden by default
  var css = '[data-pftrigger], [data-pfrecommend]{ display: none; }',
      style = document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet) { // handle ie
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName('head')[0].appendChild(style);
}

/** @module pathfora/initialize-inline */

function initializeInline () {
  var pf = this;

  pf.onDOMready(function () {
    pf.addCallback(function () {
      if (pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        }
      }

      pf.inline.procElements();
    });
  });
}

/** @module pathfora/ab-testing/init-ab-test */

function initializeABTesting (abTests) {
  abTests.forEach(function (abTest) {
    var abTestingType = abTest.type,
        userAbTestingValue = utils.readCookie(abTest.cookieId),
        userAbTestingGroup = 0,
        date = new Date();

    if (!userAbTestingValue) {
      // Support old cookie name convention
      userAbTestingValue = utils.readCookie(abHashMD5 + abTest.id);

      if (!userAbTestingValue) {
        userAbTestingValue = Math.random();
      }
    }

    // NOTE Always update the cookie to get the new exp date.
    date.setDate(date.getDate() + 365);
    saveCookie(abTest.cookieId, userAbTestingValue, date);

    // NOTE Determine visible group for the user
    var i = 0;
    while (i < 1) {
      i += abTestingType.groups[userAbTestingGroup];

      if (userAbTestingValue <= i) {
        break;
      }

      userAbTestingGroup++;
    }

    // NOTE Notify widgets about their proper AB groups
    abTest.groups.forEach(function (group, index) {
      group.forEach(function (widget) {
        if (typeof widget.abTestingGroup === 'undefined') {
          widget.abTestingGroup = index;
          widget.hiddenViaABTests = userAbTestingGroup === index;
        } else {
          throw new Error('Widget #' + widget.config.id + ' is defined in more than one AB test.');
        }
      });
    });

    if (typeof pathforaDataObject.abTestingGroups[abTest.id] !== 'undefined') {
      throw new Error('AB test with ID=' + abTest.id + ' has been already defined.');
    }

    pathforaDataObject.abTestingGroups[abTest.id] = userAbTestingGroup;
  });
}

/** @module pathfora/ab-test/ab-test */

function ABTest (config) {
  var test = {};

  if (!config) {
    throw new Error('Config object is missing');
  }

  test.id = config.id;
  test.cookieId = PREFIX_AB_TEST + config.id;
  test.groups = config.groups;

  if (!abTestingTypes[config.type]) {
    throw new Error('Unknown AB testing type: ' + config.type);
  }

  test.type = abTestingTypes[config.type];

  return test;
}

/** @module pathfora/facebook */

function integrateWithFacebook (appId) {
  if (appId !== '') {
    var btn = templates$1.social.facebookBtn.replace(
      /(\{){2}facebook-icon(\}){2}/gm,
      templates$1.assets.facebookIcon
    );

    var parseFBLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='fb-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.5',
        status: true,
        cookie: true
      });

      core.onFacebookLoad();
    };

    // NOTE API initialization
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    parseFBLoginTemplate(templates$1.form);
    parseFBLoginTemplate(templates$1.sitegate);

    pathforaDataObject.socialNetworks.facebookAppId = appId;
  }
}

/** @module pathfora/integrations/google */

function integrateWithGoogle (clientId) {
  if (clientId !== '') {
    var head = document.querySelector('head');

    var appMetaTag = templates$1.social.googleMeta.replace(
      /(\{){2}google-clientId(\}){2}/gm,
      clientId
    );

    var btn = templates$1.social.googleBtn.replace(
      /(\{){2}google-icon(\}){2}/gm,
      templates$1.assets.googleIcon
    );

    var parseGoogleLoginTemplate = function (parentTemplates) {
      Object.keys(parentTemplates).forEach(function (type) {
        parentTemplates[type] = parentTemplates[type].replace(
          /<p name='google-login' hidden><\/p>/gm,
          btn
        );
      });
    };

    head.innerHTML += appMetaTag;

    window.___gcfg = {
      parsetags: 'onload'
    };

    window.pathforaGoogleOnLoad = core.onGoogleLoad;

    // NOTE Google API
    (function () {
      var s, po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/platform.js?onload=pathforaGoogleOnLoad';
      s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    }());

    pathforaDataObject.socialNetworks.googleClientID = clientId;
    parseGoogleLoginTemplate(templates$1.form);
    parseGoogleLoginTemplate(templates$1.sitegate);
  }
}

/** @module pathfora */
window.Pathfora = function () {
  this.version = '0.1.4';
  this.callbacks = [];
  this.acctid = '';
  this.locale = 'en-US';
  this.dateOptions = {};
  this.DOMLoaded = false;
  this.triggeredWidgets = {};
  this.customData = {};

  this.addCallback = addCallback;
  this.initializePageViews = initializePageViews;
  this.onDOMready = onDOMready;

  this.initializeInline = initializeInline;

  this.triggerWidgets = triggerWidgets;
  this.initializeWidgets = initializeWidgets;
  this.previewWidgets = previewWidget;
  this.showWidget = showWidget;
  this.closeWidget = closeWidget;
  this.clearAll = clearAll;
  // this.prioritizedWidgets = prioritizedWidgets;
  this.reinitializePrioritizedWidgets = reinitializePrioritizedWidgets;
  this.Message = Message;
  this.Subscription = Subscription;
  this.Form = Form;
  this.SiteGate = SiteGate;

  this.initializeABTesting = initializeABTesting;
  this.ABTest = ABTest;

  this.integrateWithFacebook = integrateWithFacebook;
  this.integrateWithGoogle = integrateWithGoogle;

  this.initializePageViews();
  this.inline = new Inline(this);
  this.initializeInline();
};

}());
