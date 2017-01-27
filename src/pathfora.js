/* global jstag, ga */
'use strict';

/**
 * @module Pathfora-API
 */
(function (context, document) {
  // NOTE Output & processing variables
  var Pathfora, utils, core, api, Inline;

  // NOTE Default configuration object (originalConf is used when default data gets overriden)
  var originalConf;

  var defaultPositions = {
    modal: '',
    slideout: 'bottom-left',
    button: 'top-left',
    bar: 'top-absolute',
    folding: 'bottom-left'
  };

  var defaultProps = {
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
      showSocialLogin: false,
      showForm: true
    }
  };

  // NOTE HTML templates
  // FUTURE Move to separate files and concat
  /* eslint-disable indent */
  var templates = {{templates}};
  /* eslint-enable indent */

  // NOTE Event callback types
  var callbackTypes = {
    INIT: 'widgetInitialized',
    LOAD: 'widgetLoaded',
    CLICK: 'buttonClicked',
    FORM_SUBMIT: 'formSubmitted',
    MODAL_OPEN: 'modalOpened',
    MODAL_CLOSE: 'modalClosed'
  };

  // NOTE AB testing types
  /**
   * @function createABTestingModePreset
   * @description Create an A/B testing object preset from groups list
   * @returns {object} A/B testing object instance
   */
  var createABTestingModePreset = function () {
    var groups = [];

    for (var i = 0; i < arguments.length; i++) {
      groups.push(arguments[i]);
    }

    var groupsSum = groups.reduce(function (sum, element) {
      return sum + element;
    });

    // NOTE If groups collapse into a number greater than 1, normalize
    if (groupsSum > 1) {
      var groupsSumRatio = 1 / groupsSum;

      groups = groups.map(function (element) {
        return element * groupsSumRatio;
      });
    }

    return {
      groups: groups,
      groupsNumber: groups.length
    };
  };

  /*
   * @global
   * @property abHashMD5
   * @description Hash used as the AB testing cookie (MD5 'ab')
   */
  var abHashMD5 = '187ef4436122d1cc2f40dc2b92f0eba0';
  /*
   * @global
   * @property abTestingTypes
   * @description AB testing groups definitions
   */
  var abTestingTypes = {
    '100': createABTestingModePreset(100),
    '50/50': createABTestingModePreset(50, 50),
    '80/20': createABTestingModePreset(80, 20)
  };

  // NOTE Empty Pathfora data object, containg all data stored by lib
  /*
   * @global
   * @property pathforaDataObject
   * @description Pathfora data state object
   */
  var pathforaDataObject = {
    pageViews: 0,
    timeSpentOnPage: 0,
    closedWidgets: [],
    completedActions: [],
    cancelledActions: [],
    displayedWidgets: [],
    abTestingGroups: [],
    socialNetworks: {}
  };

  /**
   * @function appendPathforaStylesheet
   * @description Append pathfora stylesheet to document
   */
  var appendPathforaStylesheet = function () {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '{{cssurl}}');

    head.appendChild(link);
  };

  /**
   * @namespace
   * @name utils
   * @description Helper utility functions
   */
  utils = {

    /**
     * @description Check if DOM node has the provided class
     * @param   {object}  DOMNode   DOM element
     * @param   {string}  className class name
     */
    hasClass: function (DOMNode, className) {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(DOMNode.className);
    },

    /**
     * @description Add new classes to the DOM node (removes duplicates)
     * @param   {object} DOMNode   DOM element
     * @param   {string} className class name(s)
     */
    addClass: function (DOMNode, className) {
      // NOTE Not necessary, but leaves a clean code after mutations
      this.removeClass(DOMNode, className);

      DOMNode.className = [
        DOMNode.className,
        className
      ].join(' ');
    },

    /**
     * @description Remove classes from the DOM node
     * @param {object} DOMNode   DOM element
     * @param {string} className class name(s)
     */
    removeClass: function (DOMNode, className) {
      var findClassRegexp = new RegExp([
        '(^|\\b)',
        className.split(' ').join('|'),
        '(\\b|$)'
      ].join(''), 'gi');

      DOMNode.className = DOMNode.className.replace(findClassRegexp, ' ');
    },

    /**
     * @description Read browser Cookie value of specified name
     * @param   {string} name cookie name
     * @returns {string} cookie value
     */
    readCookie: function (name) {
      var cookies = document.cookie,
          findCookieRegexp = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

      return findCookieRegexp ? findCookieRegexp.pop() : null;
    },

    /**
     * @description Save a new cookie
     * @param {string} name  cookie name
     * @param {string} value cookie value
     * @param {number} days  days until the cookie expires
     */
    saveCookie: function (name, value, expiration) {
      var expires;

      if (expiration) {
        expires = '; expires=' + expiration.toUTCString();
      } else {
        expires = '';
      }

      context.document.cookie = [
        name,
        '=',
        value,
        expires,
        '; path = /'
      ].join('');
    },

    /**
     * @description Generate unique ID
     * @returns {string} unique id
     */
    generateUniqueId: function () {
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
    },

    /**
     * @description Return the basic object required for targetting
     * @returns {obj}
     */
    initWidgetScaffold: function () {
      return {
        target: [],
        exclude: [],
        inverse: []
      };
    },

    /**
     * @description Insert widget into existing scaffold
     * @param {obj} scaffold
     * @param {string} segment
     * @param {obj} widget
     * @throws {Error} error
     */
    insertWidget: function (method, segment, widget, config) {
      // assume that we need to add a new widget until proved otherwise
      var subject,
          makeNew = true;

      // make sure our scaffold is valid
      if (!config.target) {
        throw new Error('Invalid scaffold. No target array.');
      }
      if (!config.exclude) {
        throw new Error('Invalid scaffold. No exclude array.');
      }
      if (!config.inverse) {
        throw new Error('Invalid scaffold. No inverse array.');
      }

      if (method === 'target') {
        subject = config.target;
      } else if (method === 'exclude') {
        subject = config.exclude;
      } else {
        throw new Error('Invalid method (' + method + ').');
      }

      for (var i = 0; i < subject.length; i++) {
        var wgt = subject[i];

        if (wgt.segment === segment) {
          wgt.widgets.push(widget);
          makeNew = false;
        }
      }

      if (makeNew) {
        subject.push({
          'segment': segment,
          'widgets': [widget]
        });
      }
    },

    /**
     * @description Escape URIs optionally without double-encoding
     * @param   {string}  text                 the uri text to escape
     * @param   {obj}     options
     * @param   {boolean} options.usePlus      escape `space` to `+` instead of `%20`
     * @param   {boolean} options.keepEscaped  do not double-encode text
     * @returns {string}  uri                  the uri-escaped text
     */
    escapeURI: function (text, options) {
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
    },

    /**
     * @description Turn an objects' key/values into a query param string
     * @param   {obj}     params     object containing query params
     */
    constructQueries: function (params) {
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
  };

  /**
   * @namespace
   * @name core
   * @description Core library function set
   */
  core = {
    delayedWidgets: {},
    openedWidgets: [],
    initializedWidgets: [],
    readyWidgets: [],
    expiration: null,
    pageViews: ~~utils.readCookie('PathforaPageView'),

    /**
     * @description Display a single widget
     *              or register a handler for displaying it later
     * @param {object} widget
     */
    initializeWidget: function (widget) {
      var watcher,
          condition = widget.displayConditions;

      widget.watchers = [];

      // NOTE Default cookie expiration is one year from now
      core.expiration = new Date();
      core.expiration.setDate(core.expiration.getDate() + 365);

      if (widget.pushDown) {
        if (widget.layout === 'bar' && (widget.position === 'top-fixed' || widget.position === 'top-absolute')) {
          utils.addClass(document.querySelector(widget.pushDown), 'pf-push-down');
        } else {
          throw new Error('Only top positioned bar widgets may have a pushDown property');
        }
      }

      // display conditions based on page load
      if (condition.date) {
        widget.valid = widget.valid && core.dateChecker(condition.date);
      }

      if (condition.pageVisits) {
        widget.valid = widget.valid && core.pageVisitsChecker(condition.pageVisits);
      }

      if (condition.hideAfterAction) {
        widget.valid = widget.valid && core.hideAfterActionChecker(condition.hideAfterAction, widget);
      }
      if (condition.urlContains) {
        widget.valid = widget.valid && core.urlChecker(condition.urlContains);
      }

      widget.valid = widget.valid && condition.showOnInit;

      // display conditions based on page interaction
      if (condition.showOnExitIntent) {
        core.initializeExitIntent(widget);
      }

      if (condition.displayWhenElementVisible) {
        watcher = core.registerElementWatcher(condition.displayWhenElementVisible, widget);
        widget.watchers.push(watcher);
        core.initializeScrollWatchers(widget);
      }

      if (condition.scrollPercentageToDisplay) {
        watcher = core.registerPositionWatcher(condition.scrollPercentageToDisplay, widget);
        widget.watchers.push(watcher);
        core.initializeScrollWatchers(widget);
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
        if (condition.impressions) {
          widget.valid = widget.valid && core.impressionsChecker(condition.impressions, widget);
        }

        if (widget.valid) {
          context.pathfora.showWidget(widget);
        }
      }
    },

    /**
     * @description Take array of scroll aware elements
     *              and check if it should display any
     *              when user is scrolling the page
     * @param {array} watchers
     */
    initializeScrollWatchers: function (widget) {
      if (!core.scrollListener) {

        widget.scrollListener = function () {
          var valid;

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

            if (typeof document.addEventListener === 'function') {
              document.removeEventListener('scroll', widget.scrollListener);
              document.removeEventListener('mouseout', widget.scrollListener);
            } else {
              context.onscroll = null;
              context.onscroll = null;
            }
          }
        };

        // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
        if (typeof context.addEventListener === 'function') {
          context.addEventListener('scroll', widget.scrollListener, false);
        } else {
          context.onscroll = widget.scrollListener;
        }
      }
      return true;
    },

    /**
     * @param widget
     */
    initializeExitIntent: function (widget) {
      var positions = [];
      if (!core.exitIntentListener) {
        widget.exitIntentListener = function (e) {
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

            if (widget.displayConditions.impressions && valid) {
              valid = core.impressionsChecker(widget.displayConditions.impressions, widget);
            }

            if (valid) {
              context.pathfora.showWidget(widget);
              widget.valid = false;

              if (typeof document.addEventListener === 'function') {
                document.removeEventListener('mousemove', widget.exitIntentListener);
                document.removeEventListener('mouseout', widget.exitIntentTrigger);
              } else {
                document.onmousemove = null;
                document.onmouseout = null;
              }
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
    },

    /**
     * @description check if a manualTrigger widget
     * is ready to be displayed, and if so display the widget
     * @param {object} widget
     */
    triggerWidget: function (widget) {
      var valid;

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
        context.pathfora.triggeredWidgets[widget.id] = false;

        // remove from the ready widgets list
        core.readyWidgets.some(function (w, i) {
          if (w.id === widget.id) {
            core.readyWidgets.splice(i, 1);
            return true;
          }
        });
      }

      return valid;
    },

    /**
     * @description Parse url queries as an object
     * @param {string} url
     */
    parseQuery: function (url) {
      var query = {},
          pieces = utils.escapeURI(url, { keepEscaped: true }).split('?');

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
    },

    /**
     * @description Compare query params between the url
     *              the user is visiting and the match
     *              rule provided
     * @param {obj} queries
     * @param {obj} matchQueries
     * @param {string} rule
     */
    compareQueries: function (query, matchQuery, rule) {
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
    },

    phraseChecker: function (phrase, url, simpleurl, queries) {
      var valid = false;

      // legacy match allows for an array of strings, check if we are legacy or current object approach
      switch (typeof phrase) {
      case 'string':
        if (url.indexOf(utils.escapeURI(phrase.split('?')[0], { keepEscaped: true })) !== -1) {
          valid = core.compareQueries(queries, core.parseQuery(phrase), 'substring');
        }
        break;

      case 'object':
        if (phrase.match && phrase.value) {
          var phraseValue = utils.escapeURI(phrase.value, { keepEscaped: true });

          switch (phrase.match) {
          // simple match
          case 'simple':
            if (simpleurl === phrase.value) {
              valid = true;
            }
            break;

          // exact match
          case 'exact':
            if (url.split('?')[0].replace(/\/$/, '') === phraseValue.split('?')[0].replace(/\/$/, '')) {
              valid = core.compareQueries(queries, core.parseQuery(phraseValue), phrase.match);
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
              valid = core.compareQueries(queries, core.parseQuery(phraseValue), phrase.match);
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
    },

    urlChecker: function (phrases) {
      var url = utils.escapeURI(window.location.href, { keepEscaped: true }),
          simpleurl = window.location.hostname + window.location.pathname,
          queries = core.parseQuery(url),
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
            excludeValid = core.phraseChecker(phrase, url, simpleurl, queries) || excludeValid;
            excludeCt++;
          } else {
            valid = core.phraseChecker(phrase, url, simpleurl, queries) || valid;
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
    },

    pageVisitsChecker: function (pageVisitsRequired) {
      return (core.pageViews >= pageVisitsRequired);
    },

    dateChecker: function (date) {
      var valid = true,
          today = Date.now();

      if (date.start_at && today < new Date(date.start_at).getTime()) {
        valid = false;
      }

      if (date.end_at && today > new Date(date.end_at).getTime()) {
        valid = false;
      }

      return valid;
    },

    impressionsChecker: function (impressionConstraints, widget) {
      var parts, totalImpressions,
          valid = true,
          id = 'PathforaImpressions_' + widget.id,
          sessionImpressions = ~~sessionStorage.getItem(id),
          total = utils.readCookie(id),
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
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? total.split(',') : parts;

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
          valid = false;
        }
      }

      if (sessionImpressions > impressionConstraints.session || totalImpressions > impressionConstraints.total) {
        valid = false;
      }


      if (valid && widget.valid) {
        sessionStorage.setItem(id, sessionImpressions);
        utils.saveCookie(id, Math.min(totalImpressions, 9998) + '|' + now, core.expiration);
      }

      return valid;
    },

    hideAfterActionChecker: function (hideAfterActionConstraints, widget) {
      var parts,
          valid = true,
          now = Date.now(),
          confirm = utils.readCookie('PathforaConfirm_' + widget.id),
          cancel = utils.readCookie('PathforaCancel_' + widget.id),
          closed = utils.readCookie('PathforaClosed_' + widget.id);

      if (hideAfterActionConstraints.confirm && confirm) {
        parts = confirm.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? confirm.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.confirm.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.cancel && cancel) {
        parts = cancel.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? cancel.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.cancel.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.closed && closed) {
        parts = closed.split('|');
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? closed.split(',') : parts;

        if (parseInt(parts[0], 10) >= hideAfterActionConstraints.closed.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
          valid = false;
        }
      }

      return valid;
    },

    /**
     * @description Register a time-tiggered widget
     * @param {object} widget
     */
    registerDelayedWidget: function (widget) {
      this.delayedWidgets[widget.id] = setTimeout(function () {
        core.initializeWidget(widget);
      }, widget.displayConditions.showDelay * 1000);
    },

    /**
     * @description Prevent timely delayed widget from initialization
     * @param {object} widget
     */
    cancelDelayedWidget: function (widget) {
      var delayObj = this.delayedWidgets[widget.id];

      if (delayObj) {
        clearTimeout(delayObj);
        delete this.delayedWidgets[widget.id];
      }
    },

    /**
     * @description Register a custom javascript watcher
     * @param   {number} percent scroll percentage at
     *                   which the widget should be displayed
     * @param   {object} widget
     * @returns {object} object, containing onscroll callback function 'check'
     */
    registerPositionWatcher: function (percent, widget) {
      var watcher = {
        check: function () {
          var positionInPixels = (document.body.offsetHeight - window.innerHeight) * percent / 100,
              offset = document.documentElement.scrollTop || document.body.scrollTop;
          if (offset >= positionInPixels) {
            core.removeWatcher(watcher, widget);
            return true;
          }
          return false;
        }
      };

      return watcher;
    },


    /**
     * @description Register a manual js triggered widget listener
     * @param   {boolean} value of the manualTrigger condition
     * @param   {object}  widget
     * @returns {object}  object, containing callback function 'check'
     */
    registerManualTriggerWatcher: function (value, widget) {
      var watcher = {
        check: function () {
          if (value && context.pathfora && context.pathfora.triggeredWidgets[widget.id] || context.pathfora.triggeredWidgets['*']) {
            core.removeWatcher(watcher, widget);
            return true;
          }
          return false;
        }
      };

      return watcher;
    },

    /**
     * @description Register element visibility-triggered widget
     * @param   {string} id     trigger element id (DOMElement.id property)
     * @param   {object} widget
     * @returns {object} object, containing onscroll callback function 'check', and
     *                   triggering element reference 'elem'
     */
    registerElementWatcher: function (selector, widget) {
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
    },

    /**
     * @description Unassign a watcher
     * @param {object} watcher
     */
    removeWatcher: function (watcher, widget) {
      for (var key in widget.watchers) {
        if (widget.watchers.hasOwnProperty(key) && watcher === widget.watchers[key]) {
          widget.watchers.splice(key, 1);
        }
      }
    },

    /**
     * @description Construct DOM layout for the widget
     * @throws {Error} error
     * @param {object} widget
     * @param {object} config
     */
    constructWidgetLayout: function (widget, config) {
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
          branding.innerHTML = templates.assets.lytics;
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
          var element = getFormElement(field),
              parent = element.parentNode;

          if (element && !config.fields[field] && parent) {
            parent.removeChild(element);
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
                utils.addClass(element, 'right');

                if (!(prev && prev.className.indexOf('pf-field-half-width') !== -1)) {
                  utils.removeClass(element, 'pf-field-half-width');
                }

              } else if (!(next && next.className.indexOf('pf-field-half-width') !== -1)) { // even
                utils.removeClass(element, 'pf-field-half-width');
              }
            }
          }
        });

        // For select boxes we need to control the color of
        // the placeholder text
        var selects = widget.querySelectorAll('select');

        for (i = 0; i < selects.length; i++) {
          // default class indicates the placeholder text color
          utils.addClass(selects[i], 'default');

          selects[i].onchange = function () {
            if (this.selectedIndex !== 0) {
              utils.removeClass(this, 'default');
            } else {
              utils.addClass(this, 'default');
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
    },

    /**
     * @description Append event handlers to the widget
     * @param {object} widget
     * @param {object} config
     */
    constructWidgetActions: function (widget, config) {
      var widgetOnButtonClick, widgetOnFormSubmit,
          widgetOk = widget.querySelector('.pf-widget-ok');

      var widgetOnModalClose = function (event) {
        if (typeof config.onModalClose === 'function') {
          config.onModalClose(callbackTypes.MODAL_CLOSE, {
            widget: widget,
            event: event
          });
        }
      };

      var updateActionCookie = function (name) {
        var ct,
            val = utils.readCookie(name),
            duration = Date.now();

        if (val) {
          val = val.split('|');
          // NOTE Retain support for cookies with comma - can remove on 5/2/2016
          val = val.length === 1 ? val.split(',') : val;
          ct = Math.min(parseInt(val[0], 10), 9998) + 1;
        } else {
          ct = 1;
        }

        utils.saveCookie(name, ct + '|' + duration, core.expiration);
      };

      // Tracking for widgets with a form element
      switch (config.type) {
      case 'form':
      case 'sitegate':
      case 'subscription':
        var widgetForm = widget.querySelector('form');

        var onInputChange = function (event) {
          if (event.target.value && event.target.value.length > 0) {
            core.trackWidgetAction('form_start', config, event.target);
          }
        };

        var onInputFocus = function (event) {
          core.trackWidgetAction('focus', config, event.target);
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
              formElements = Array.prototype.slice.call(widgetForm.querySelectorAll('input, textarea, select'));

          for (var i = 0; i < formElements.length; i++) {
            var inputField = formElements[i];

            if (inputField.hasAttribute('data-required')) {
              inputField.setAttribute('data-required', 'true');

              // Check for required field and email validation
              if (!inputField.value || (inputField.getAttribute('type') === 'email' && inputField.value.indexOf('@') === -1)) {
                valid = false;
                inputField.setAttribute('data-required', 'active');
                inputField.focus();
                break;
              }
            }
          }

          if (valid && widgetAction) {
            core.trackWidgetAction(widgetAction, config, widgetForm);

            if (typeof config.onSubmit === 'function') {
              config.onSubmit(callbackTypes.FORM_SUBMIT, {
                widget: widget,
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
            core.trackWidgetAction('hover', config, event.target);
          };

          widgetClose.onclick = function (event) {
            context.pathfora.closeWidget(widget.id);
            updateActionCookie('PathforaClosed_' + widget.id);
            widgetOnModalClose(event);
          };
        }

        if (widgetCancel) {
          widgetCancel.onmouseenter = function (event) {
            core.trackWidgetAction('hover', config, event.target);
          };

          if (typeof config.cancelAction === 'object') {
            widgetCancel.onclick = function (event) {
              core.trackWidgetAction('cancel', config);
              if (typeof config.cancelAction.callback === 'function') {
                config.cancelAction.callback();
              }
              updateActionCookie('PathforaCancel_' + widget.id);
              context.pathfora.closeWidget(widget.id, true);
              widgetOnModalClose(event);
            };
          } else {
            widgetCancel.onclick = function (event) {
              core.trackWidgetAction('cancel', config);
              updateActionCookie('PathforaCancel_' + widget.id);
              context.pathfora.closeWidget(widget.id, true);
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
            core.trackWidgetAction('confirm', config);
            updateActionCookie('PathforaConfirm_' + widget.id);

            if (typeof config.confirmAction === 'object' && typeof config.confirmAction.callback === 'function') {
              config.confirmAction.callback();
            }
            if (typeof widgetOnButtonClick === 'function') {
              widgetOnButtonClick(event);
            }

            widgetOnModalClose(event);

            if (config.layout !== 'inline' && typeof config.success === 'undefined') {
              context.pathfora.closeWidget(widget.id, true);

            // show success state
            } else {
              utils.addClass(widget, 'success');

              // default to a three second delay if the user has not defined one
              var delay = typeof config.success.delay !== 'undefined' ? config.success.delay * 1000 : 3000;

              if (delay > 0) {
                setTimeout(function () {
                  pathfora.closeWidget(widget.id, true);
                }, delay);
              }
            }
          }
        };
      }
    },

    /**
     * @description Build color theme for the widget
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetColors: function (widget, config) {
      switch (config.theme) {
      case 'custom':
        if (config.colors) {
          core.setCustomColors(widget, config.colors);
        }
        break;
      case 'none':
        // Do nothing, we will rely on CSS for the colors
        break;
      default:
        if (config.theme) {
          core.setCustomColors(widget, defaultProps.generic.themes[config.theme]);
        }
        break;
      }
    },

    /**
     * @description Generate and set class names for the widget
     * @param {object} widget
     * @param {object} config
     */
    setWidgetClassname: function (widget, config) {
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
    },

    /**
     * @description Setup content recommendation if we have one
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetContentUnit: function (widget, config) {
      var widgetContentUnit = widget.querySelector('.pf-content-unit');

      if (config.recommend && config.content) {
        // Make sure we have content to get
        if (Object.keys(config.content).length > 0) {

          // The top recommendation should be default if we couldn't
          // get one from the api
          var rec = config.content[0],
              recImage = document.createElement('div'),
              recMeta = document.createElement('div'),
              recTitle = document.createElement('h4'),
              recDesc = document.createElement('p');

          widgetContentUnit.href = rec.url;

          // image div
          recImage.className = 'pf-content-unit-img';
          recImage.style.backgroundImage = "url('" + rec.image + "')";
          widgetContentUnit.appendChild(recImage);

          recMeta.className = 'pf-content-unit-meta';

          // title h4
          recTitle.innerHTML = rec.title;
          recMeta.appendChild(recTitle);

          // description p
          recDesc.innerHTML = rec.description;
          recMeta.appendChild(recDesc);

          widgetContentUnit.appendChild(recMeta);
        }
      }
    },

    /**
     * Validate position for a widget of specific type
     * @param   {object}   widget
     * @param   {object}   config
     */
    validateWidgetPosition: function (widget, config) {
      var choices;

      switch (config.layout) {
      case 'modal':
        choices = [''];
        break;
      case 'slideout':
        choices = ['bottom-left', 'bottom-right'];
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
    },

    /**
     * @description Set default widget position, if current one is invalid
     * @param {object} widget
     * @param {object} config
     */
    setupWidgetPosition: function (widget, config) {
      if (config.position) {
        this.validateWidgetPosition(widget, config);
      } else {
        config.position = defaultPositions[config.layout];
      }
    },

    /**
     * @description Construct DOM element for the widget
     * @param   {object} config
     * @returns {object} widget DOM element
     */
    createWidgetHtml: function (config) {
      var widget = document.createElement('div');

      widget.innerHTML = templates[config.type][config.layout] || '';
      widget.id = config.id;

      if (widget.innerHTML === '') {
        throw new Error('Could not get pathfora template based on type and layout.');
      }

      this.setupWidgetPosition(widget, config);
      this.constructWidgetActions(widget, config);
      this.setupWidgetContentUnit(widget, config);
      this.setWidgetClassname(widget, config);
      this.constructWidgetLayout(widget, config);
      this.setupWidgetColors(widget, config);

      return widget;
    },

    // FIXME Inefficient and inaccurate, either cache initial time and subtract
    //       or calculate delta
    /**
     * @description Track time spent on page
     */
    trackTimeOnPage: function () {
      core.tickHandler = setInterval(function () {
        pathforaDataObject.timeSpentOnPage += 1;
      }, 1000);
    },

    /**
     * @description Determine whether the user visited the site before (set the cookie)
     * @returns {boolean}
     */
    checkIfUserJustEntered: function () {
      if (!utils.readCookie('PathforaInit')) {
        utils.saveCookie('PathforaInit', true, core.expiration);
        return true;
      }
      return false;
    },

    /**
     * @description Set custom color theme for the widget
     * @param {object} widget
     * @param {object} colors custom theme
     */
    setCustomColors: function (widget, colors) {
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
          socialBtns = Array.prototype.slice.call(widget.querySelectorAll('.social-login-btn'));

      if (colors.background) {
        if (utils.hasClass(widget, 'pf-widget-modal')) {
          widget.querySelector('.pf-widget-content').style.backgroundColor = colors.background;
        } else {
          widget.style.backgroundColor = colors.background;
        }
      }

      if (colors.fieldBackground) {
        for (i = 0; i < fields.length; i++) {
          fields[i].style.backgroundColor = colors.fieldBackground;
        }
      }

      if (contentUnit && contentUnitMeta) {
        if (colors.actionBackground) {
          contentUnit.style.backgroundColor = colors.actionBackground;
        }

        if (colors.actionText) {
          contentUnitMeta.querySelector('h4').style.color = colors.actionText;
        }

        if (colors.text) {
          contentUnitMeta.querySelector('p').style.color = colors.text;
        }
      }

      if (close && colors.close) {
        close.style.color = colors.close;
      }

      if (headline && colors.headline) {
        for (i = 0; i < headline.length; i++) {
          headline[i].style.color = colors.headline;
        }
      }

      if (headlineLeft && colors.headline) {
        headlineLeft.style.color = colors.headline;
      }

      if (arrow && colors.close) {
        arrow.style.color = colors.close;
      }

      if (arrowLeft && colors.close) {
        arrowLeft.style.color = colors.close;
      }

      if (cancelBtn) {
        if (colors.cancelText) {
          cancelBtn.style.color = colors.cancelText;
        }

        if (colors.cancelBackground) {
          cancelBtn.style.backgroundColor = colors.cancelBackground;
        }
      }

      if (okBtn) {
        if (colors.actionText) {
          okBtn.style.color = colors.actionText;
        }

        if (colors.actionBackground) {
          okBtn.style.backgroundColor = colors.actionBackground;
        }
      }

      if (colors.text && branding) {
        branding.style.fill = colors.text;
      }


      socialBtns.forEach(function (btn) {
        if (colors.actionText) {
          btn.style.color = colors.actionText;
        }

        if (colors.actionBackground) {
          btn.style.backgroundColor = colors.actionBackground;
        }
      });

      if (msg && colors.text) {
        for (i = 0; i < msg.length; i++) {
          msg[i].style.color = colors.text;
        }
      }
    },

    /**
     * @description Report data related to the user action with widget
     * @list  actions   [close, show, confirm, cancel, submit, subscribe]
     * @param {string}  action      action name
     * @param {object}  widget      related widget
     * @param {Element} htmlElement related DOM element
     */
    trackWidgetAction: function (action, widget, htmlElement) {
      var child, childName, elem;

      var params = {
        'pf-widget-id': widget.id,
        'pf-widget-type': widget.type,
        'pf-widget-layout': widget.layout,
        'pf-widget-variant': widget.variant
      };

      switch (action) {
      case 'show':
        pathforaDataObject.displayedWidgets.push(params);
        break;
      case 'close':
        pathforaDataObject.closedWidgets.push(params);
        break;
      case 'confirm':
        params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || 'default confirm';
        pathforaDataObject.completedActions.push(params);
        break;
      case 'cancel':
        params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || 'default cancel';
        pathforaDataObject.cancelledActions.push(params);
        break;
      case 'submit':
        for (elem in htmlElement.children) {
          if (htmlElement.children.hasOwnProperty(elem)) {
            child = htmlElement.children[elem];
            if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
              childName = child.getAttribute('name');
              params['pf-form-' + childName] = child.value;
            }
          }
        }
        break;
      case 'subscribe':
        params['pf-form-email'] = htmlElement.elements.email.value;
        break;
      case 'unlock':
        for (elem in htmlElement.children) {
          if (htmlElement.children.hasOwnProperty(elem)) {
            child = htmlElement.children[elem];
            if (typeof child.getAttribute !== 'undefined' && child.getAttribute('name') !== null) {
              childName = child.getAttribute('name');
              params['pf-form-' + childName] = child.value;
            }
          }
        }
        utils.saveCookie('PathforaUnlocked_' + widget.id, true, core.expiration);
        break;
      case 'hover':
        if (utils.hasClass(htmlElement, 'pf-widget-ok')) {
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
      api.reportData(params);
    },

    /**
     * @description Override object with new config parameters
     * @param {object} object original object
     * @param {object} config new configuration
     */
    updateObject: function (object, config) {
      for (var prop in config) {
        if (config.hasOwnProperty(prop) && typeof config[prop] === 'object' && config[prop] !== null) {
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
    },

    /**
     * @description Initialize widgets from the given array
     * @throws {Error} error
     * @param  {array} array list of widgets to initialize
     */
    initializeWidgetArray: function (array) {
      var displayWidget = function (w) {
        if (w.displayConditions.showDelay) {
          core.registerDelayedWidget(w);
        } else {
          core.initializeWidget(w);
        }
      };

      var recContent = function (w, params) {
        pathfora.addCallback(function () {
          if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
            if (context.lio && context.lio.account) {
              pathfora.acctid = context.lio.account.id;
            } else {
              throw new Error('Could not get account id from Lytics Javascript tag.');
            }
          }

          api.recommendContent(pathfora.acctid, params, function (resp) {
            // if we get a response from the recommend api put it as the first
            // element in the content object this replaces any default content
            if (resp[0]) {
              var content = resp[0];
              w.content = {
                0: {
                  title: content.title,
                  description: content.description,
                  url: 'http://' + content.url,
                  image: content.primary_image
                }
              };
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
            defaults = defaultProps[widget.type],
            globals = defaultProps.generic;

        if (widget.type === 'sitegate' && utils.readCookie('PathforaUnlocked_' + widget.id) === 'true' || widget.hiddenViaABTests === true) {
          continue;
        }

        if (this.initializedWidgets.indexOf(widget.id) < 0) {
          this.initializedWidgets.push(widget.id);
        } else {
          throw new Error('Cannot add two widgets with the same id');
        }

        this.updateObject(widget, globals);
        this.updateObject(widget, defaults);
        this.updateObject(widget, widget.config);

        if (widget.type === 'message' && (widget.recommend && Object.keys(widget.recommend).length !== 0) || (widget.content && widget.content.length !== 0)) {
          if (widget.layout !== 'slideout' && widget.layout !== 'modal') {
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
            widget: widget
          });
        }
      }
    },

    /**
     * @description Validate a list of widget elements
     * @throws {Error} error
     * @param {object} widgets
     */
    validateWidgetsObject: function (widgets) {
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
    },

    /**
     * @description Generate a new widget object
     * @throws {Error} error
     * @param   {string} type   widget type
     * @param   {object} config
     * @returns {object} generated widget object
     */
    prepareWidget: function (type, config) {
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
    },

    prepareABTest: function (config) {
      var test = {};

      if (!config) {
        throw new Error('Config object is missing');
      }

      test.id = config.id;
      test.cookieId = 'PathforaTest_' + config.id;
      test.groups = config.groups;

      if (!abTestingTypes[config.type]) {
        throw new Error('Unknown AB testing type: ' + config.type);
      }

      test.type = abTestingTypes[config.type];

      return test;
    },
    /**
     * @description Load callback for facebook integration
     */
    onFacebookLoad: function () {
      var fbBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.facebook-login-btn span'));

      FB.getLoginStatus(function (connection) {
        if (connection.status === 'connected') {
          core.autoCompleteFacebookData(fbBtns);
        }
      });

      fbBtns.forEach(function (element) {
        if (element.parentElement) {
          element.parentElement.onclick = function () {
            core.onFacebookClick(fbBtns);
          };
        }
      });
    },

    /**
     * @description Attempt to load forms data from Facebook API.
     * @param {object} facebook buttons element selector
     */
    autoCompleteFacebookData: function (elements) {
      FB.api('/me', {
        fields: 'name,email,work'
      }, function (resp) {
        if (resp && !resp.error) {
          core.autoCompleteFormFields({
            type: 'facebook',
            username: resp.name || '',
            email: resp.email || ''
          });

          elements.forEach(function (item) {
            item.innerHTML = 'Log Out';
          });
        }
      });
    },

    /**
     * @description Click handler to log in/log out from facebook.
     * @param {object} facebook buttons element selector
     */
    onFacebookClick: function (elements) {
      FB.getLoginStatus(function (connection) {
        if (connection.status === 'connected') {
          FB.logout(function () {
            elements.forEach(function (elem) {
              elem.innerHTML = 'Log In';
            });
            core.clearFormFields('facebook', ['username', 'email']);
          });

        } else {
          FB.login(function (resp) {
            if (resp.authResponse) {
              core.autoCompleteFacebookData(elements);
            }
          });
        }
      });
    },

    /**
     * @description Load callback for google integration
     * @param {object} optional widget object
     */
    onGoogleLoad: function () {
      gapi.load('auth2', function () {
        var auth2 = gapi.auth2.init({
          clientId: pathforaDataObject.socialNetworks.googleClientID,
          cookiepolicy: 'single_host_origin',
          scope: 'profile'
        });

        var googleBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.google-login-btn span'));

        auth2.then(function () {
          var user = auth2.currentUser.get();
          core.autoCompleteGoogleData(user, googleBtns);

          googleBtns.forEach(function (element) {
            if (element.parentElement) {
              element.parentElement.onclick = function () {
                core.onGoogleClick(googleBtns);
              };
            }
          });
        });
      });
    },

    /**
     * @description Attempt to load forms' data from Google+ API.
     * @param {object} current googleUser
     * @param {object} google buttons element selector
     */
    autoCompleteGoogleData: function (user, elements) {
      if (typeof user !== 'undefined') {
        var profile = user.getBasicProfile();

        if (typeof profile !== 'undefined') {
          core.autoCompleteFormFields({
            type: 'google',
            username: profile.getName() || '',
            email: profile.getEmail() || ''
          });

          elements.forEach(function (item) {
            item.innerHTML = 'Sign Out';
          });
        }
      }
    },

    /**
     * @description Click handler to sign in/sign out from google.
     * @param {object} google buttons element selector
     */
    onGoogleClick: function (elements) {
      var auth2 = gapi.auth2.getAuthInstance();

      if (auth2.isSignedIn.get()) {
        auth2.signOut().then(function () {
          elements.forEach(function (elem) {
            elem.innerHTML = 'Sign In';
          });
          core.clearFormFields('google', ['username', 'email']);
        });

      } else {
        auth2.signIn().then(function () {
          core.autoCompleteGoogleData(auth2.currentUser.get(), elements);
        });
      }
    },

    /**
     * @description Fill form DOM objects with user data
     * @param {object} data user data
     */
    autoCompleteFormFields: function (data) {
      var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

      widgets.forEach(function (widget) {
        if (widget.querySelector('.' + data.type + '-login-btn')) {
          Object.keys(data).forEach(function (inputField) {
            var field = widget.querySelector('input[name="' + inputField + '"]');

            if (field && !field.value) {
              field.value = data[inputField];
            }
          });
        }
      });
    },

    /**
     * @description Clear user data from form fields
     * @param {object} type of integration
     * @param {object} fields to clear
     */
    clearFormFields: function (type, fields) {
      var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

      widgets.forEach(function (widget) {
        if (widget.querySelector('.' + type + '-login-btn')) {
          fields.forEach(function (inputField) {
            var field = widget.querySelector('input[name="' + inputField + '"]');

            if (field) {
              field.value = '';
            }
          });
        }
      });
    }
  };

  /**
   * @namespace
   * @name api
   * @description Lytics API integration tools
   */
  api = {
    /**
     * @description Prepare GET HTTP request
     * @param {string}   url       target url
     * @param {function} onSuccess success callback
     * @param {function} onError   error callback
     */
    getData: function (url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else if (xhr.readyState === 4) {
          onError(xhr.responseText);
        }
      };

      xhr.open('GET', url);
      xhr.send();
    },

    /**
     * @description Prepare POST HTTP request
     * @param {string}   url       target url
     * @param {object}   data      payload
     * @param {function} onSuccess success callback
     * @param {function} onError   error callback
     */
    postData: function (url, data, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else if (xhr.readyState === 4) {
          onError(xhr.responseText);
        }
      };

      xhr.send(data);
    },

    /**
     * @description Send data to Lytics API
     *              Optionally to Google Analytics (if 'ga' function is available)
     * @param {object} data payload
     */
    reportData: function (data) {
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
    },

    /**
     * @description Retrieve user segment data from Lytics
     */
    getUserSegments: function () {
      if (context.lio && context.lio.data && context.lio.data.segments) {
        return context.lio.data.segments;
      } else {
        return ['all'];
      }
    },

    /**
     * @description Check if a user is a member of
     * @param {match} name of segment to check for match
     */
    inSegment: function (match) {
      return (this.getUserSegments().indexOf(match) !== -1);
    },

    /**
     * @description Fetch content to recommend
     * @throws {Error} error
     * @param {string} accountId  Lytics account ID
     */
    recommendContent: function (accountId, params, callback) {
      // Recommendation API:
      // https://www.getlytics.com/developers/rest-api#content-recommendation

      var seerId = utils.readCookie('seerid');

      if (!seerId) {
        throw new Error('Cannot find SEERID cookie');
      }

      var recommendParts = [
        '{{apiurl}}/api/content/recommend/',
        accountId,
        '/user/_uids/',
        seerId
      ];


      var ql = params.ql;
      delete params.ql;

      var queries = utils.constructQueries(params);

      if (!params.contentsegment) {
        // Special case for FilterQL
        if (ql && ql.raw) {
          if (queries.length > 0) {
            queries += '&';
          } else {
            queries += '?';
          }
          queries += 'ql=' + ql.raw;
        }
      }

      var recommendUrl = recommendParts.join('') + queries;

      this.getData(recommendUrl, function (json) {
        var resp = JSON.parse(json);
        if (resp.data && resp.data.length > 0) {
          callback(resp.data);
        } else {
          callback([]);
        }
      }, function () {
        callback([]);
      });
    },

    /**
     * @description Construct filter for inline content recommendations
     * @param {string} urlPat  pattern of URL to match
     */
    constructRecommendFilter: function (urlPat) {
      // URL pattern uses wildcards '*'
      // should not contain http protocol
      // examples:
      // www.example.com/blog/posts/*
      // www.example.com/*
      // *
      // (Note: using a single wildcard results in no filtering and can
      // potentially return any url on your website)
      return 'FILTER AND(url LIKE "' + urlPat + '") FROM content';
    }
  };

  /**
   * @class
   * @name Inline
   * @description Inline Personalization
   */
  Inline = function (pathfora) {
    this.elements = [];
    this.preppedElements = [];
    this.defaultElements = [];

    /*
     * @description Prepare all the triggered or recommended elements
     * @param {attr} name of attribute to select by
     */
    this.prepElements = function (attr) {
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
    };

    /*
     * @description show/hide the elements based on membership
     */
    this.procElements = function () {
      var attrs = ['data-pftrigger', 'data-pfrecommend'],
          inline = this,
          count = 0;

      var cb = function (elements) {
        count++;
        // After we have processed all elements, proc defaults
        if (count === Object.keys(elements).length) {
          inline.setDefaultRecommend(elements);
        }
      };

      attrs.forEach(function (attr) {
        var elements = inline.prepElements(attr);

        for (var key in elements) {
          if (elements.hasOwnProperty(key)) {

            switch (attr) {
            // CASE: Segment triggered elements
            case 'data-pftrigger':
              inline.procTriggerElements(elements[key], key);
              break;

            // CASE: Content recommendation elements
            case 'data-pfrecommend':
              if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
                throw new Error('Could not get account id from Lytics Javascript tag.');
              }

              inline.procRecommendElements(elements[key], key, function () {
                cb(elements);
              });
              break;
            }
          }
        }
      });
    };

    this.procTriggerElements = function (elems, group) {
      var matched = false,
          defaultEl = {};

      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];

        // if we find a match show that and prevent others from showing in same group
        if (api.inSegment(elem.trigger) && !matched) {
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
    };

    this.procRecommendElements = function (blocks, rec, cb) {
      var inline = this;

      if (rec !== 'default') {
        // call the recommendation API using the url pattern urlPattern as a filter
        var params = {
          contentsegment: rec
        };

        api.recommendContent(pathfora.acctid, params, function (resp) {
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
                    elems.url.href = 'http://' + content.url;
                  // if attribute is on container element
                  } else {
                    elems.url.innerHTML = 'http://' + content.url;
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
    };

    this.setDefaultRecommend = function () {
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
    };

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
  };

  /**
   * @class
   * @name Pathfora
   * @description Pathfora public API class
   */
  Pathfora = function () {
    /**
     * @public
     * @description Current version
     */
    this.version = '0.0.15';

    /**
     * @public
     * @description callbacks to execute once segments load
     */
    this.callbacks = [];

    /**
     * @public
     * @description Lytics account ID required for content recos
     */
    this.acctid = '';

    /**
     * @public
     * @description Locale for formatting dates
     */
    this.locale = 'en-US';

    /**
     * @public
     * @description Additional options for formatting dates
     */
    this.dateOptions = {};

    /**
     * @public
     * @description Indicates if the DOM has been loaded
     */
    this.DOMLoaded = false;

    /**
     * @public
     * @description A list of widgets that have been triggered manually
     * using the manualTrigger display condition
     */
    this.triggeredWidgets = {};

    /**
     * @public
     * @description Add callbacks to execute once segments load
     */
    this.addCallback = function (cb) {
      if (context.lio && context.lio.loaded) {
        cb(context.lio.data);
      } else {
        this.callbacks.push(cb);
      }
    };

    /**
     * @public
     * @description Create page view cookie
     */
    this.initializePageViews = function () {
      var cookie = utils.readCookie('PathforaPageView'),
          date = new Date();
      date.setDate(date.getDate() + 365);
      utils.saveCookie('PathforaPageView', Math.min(~~cookie, 9998) + 1, date);
    };

    /**
     * @public
     * @description Listener to wait until the DOM is ready
     */
    this.onDOMready = function (fn) {
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
    };

    /**
     * @public
     * @description Initialize inline personalization
     */
    this.initializeInline = function () {
      var pf = this;

      pf.onDOMready(function () {
        pf.addCallback(function () {
          if (pf.acctid === '') {
            if (context.lio && context.lio.account) {
              pf.acctid = context.lio.account.id;
            }
          }

          pf.inline.procElements();
        });
      });
    };

    /**
     * @public
     * @description public method to trigger widgets
     * with the manualTrigger display condition
     * @param {array}   widgetsIds (optional)
     */
    this.triggerWidgets = function (widgetIds) {
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
    };

    /**
     * @public
     * @description Initialize Pathfora widgets from a container
     * @param {object|array}   widgets
     * @param {object}         config
     */
    this.initializeWidgets = function (widgets, config) {
      // NOTE IE < 10 not supported
      // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
      if (document.all && !context.atob) {
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

      core.validateWidgetsObject(widgets);
      core.trackTimeOnPage();

      if (config) {
        originalConf = JSON.parse(JSON.stringify(defaultProps));
        core.updateObject(defaultProps, config);
      }

      if (widgets instanceof Array) {

        // NOTE Simple initialization
        core.initializeWidgetArray(widgets);
      } else {

        // NOTE Target sensitive widgets
        if (widgets.common) {
          core.initializeWidgetArray(widgets.common);
          core.updateObject(defaultProps, widgets.common.config);
        }

        if (widgets.target || widgets.exclude) {
          // Add callback to initialize once we know segments are loaded
          this.addCallback(function () {
            var target, ti, tl, exclude, ei, ex, ey, el,
                targetedwidgets = [],
                excludematched = false,
                segments = api.getUserSegments();

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
              core.initializeWidgetArray(targetedwidgets);
            }

            if (!targetedwidgets.length && !excludematched && widgets.inverse) {
              core.initializeWidgetArray(widgets.inverse);
            }
          });
        }
      }
    };

    /**
     * @public
     * @description Create a minimal widget for a preview
     * @param   {object}   widget
     * @returns {object}   widget DOM element
     */
    this.previewWidget = function (widget) {
      widget.id = utils.generateUniqueId();
      return core.createWidgetHtml(widget);
    };

    /**
     * // FIXME outdated/not completed
     * @public
     * @description Set A/B testing modes for the global Pathfora object
     * @param {string} abTests A/B testing modes array
     */
    this.initializeABTesting = function (abTests) {
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
        utils.saveCookie(abTest.cookieId, userAbTestingValue, date);

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
    };

    /**
     * @public
     * @description Create a Message widget
     * @param   {object}   config
     * @returns {object}   Message widget
     */
    this.Message = function (config) {
      return core.prepareWidget('message', config);
    };

    /**
     * @public
     * @description Create a Subscription widget
     * @param   {object}   config
     * @returns {object}   Subscription widget
     */
    this.Subscription = function (config) {
      return core.prepareWidget('subscription', config);
    };

    /**
     * @public
     * @description Create a Form widget
     * @param   {object}   config
     * @returns {object}   Form widget
     */
    this.Form = function (config) {
      return core.prepareWidget('form', config);
    };

    /**
     * @public
     * @description Create a Site Gate widget
     * @param   {object}   config
     * @returns {object}   SiteGate widget
     */
    this.SiteGate = function (config) {
      return core.prepareWidget('sitegate', config);
    };

    /**
     * @public
     * @description Display a widget
     * @param {object} widget
     */
    this.showWidget = function (widget) {
      // FIXME Change to Array#filter and Array#length
      for (var i = 0; i < core.openedWidgets.length; i++) {
        if (core.openedWidgets[i] === widget) {
          return;
        }
      }

      core.openedWidgets.push(widget);
      core.trackWidgetAction('show', widget);

      var node = core.createWidgetHtml(widget);

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

        utils.addClass(node, 'opened');

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
    };

    /**
     * @public
     * @description Close the widget
     *              and remove it from DOM
     * @param {string}  id      widget it
     * @param {boolean} noTrack if true, closing action will not be recorded
     */
    this.closeWidget = function (id, noTrack) {
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
    };

    /**
     * @public
     * @description Get the current Pathfora data store
     * @returns {object} Pathfora data store
     */
    this.getData = function () {
      return pathforaDataObject;
    };

    /**
     * @public
     * @description Clean widgets and data state
     */
    this.clearAll = function () {
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
    };

    /**
     * @public
     * @description Intergrate with Facebook App API
     * @param {string} appId
     */
    this.integrateWithFacebook = function (appId) {
      if (appId !== '') {
        var btn = templates.social.facebookBtn.replace(
          /(\{){2}facebook-icon(\}){2}/gm,
          templates.assets.facebookIcon
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

        parseFBLoginTemplate(templates.form);
        parseFBLoginTemplate(templates.sitegate);

        pathforaDataObject.socialNetworks.facebookAppId = appId;
      }
    };

    /**
     * @public
     * @description Integrate with Google App API
     * @param {string} clientId
     */
    this.integrateWithGoogle = function (clientId) {
      if (clientId !== '') {
        var head = document.querySelector('head');

        var appMetaTag = templates.social.googleMeta.replace(
          /(\{){2}google-clientId(\}){2}/gm,
          clientId
        );

        var btn = templates.social.googleBtn.replace(
          /(\{){2}google-icon(\}){2}/gm,
          templates.assets.googleIcon
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
        parseGoogleLoginTemplate(templates.form);
        parseGoogleLoginTemplate(templates.sitegate);
      }
    };

    /*
     * @public
     */
    this.ABTest = function (config) {
      return core.prepareABTest(config);
    };

    /*
     * @public
     * @description Get utils object
     */
    this.utils = utils;

    /*
     * @public
     * @description Inline personalization class
     */
    this.inline = new Inline(this);
    this.initializeInline();

    this.initializePageViews();
  };

  // NOTE Initialize context
  appendPathforaStylesheet();
  context.pathfora = new Pathfora();

}(window, document));
