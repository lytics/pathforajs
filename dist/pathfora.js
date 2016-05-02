/* global jstag, ga, pfCfg */
"use strict";

/**
 * @module Pathfora-API
 */
(function (context, document) {
  // NOTE Output & processing variables
  var Pathfora;
  var utils;
  var core;
  var api;

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
      headline: '',
      theme: 'default',
      themes: {
        default: {
          background: '#f1f1f1',
          headline: '#444',
          text: '#888',
          close: '#bbb',
          actionText: '#444',
          actionBackground: '#fff',
          cancelText: '#bbb',
          cancelBackground: '#f1f1f1'
        },
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
    welcome: {
      layout: 'modal',
      position: '',
      variant: '1'
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
        message: 'Message'
      },
      required: {
        name: true,
        email: true
      },
      fields: {},
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
        email: 'Email',
        organization: 'Organization',
        title: 'Title'
      },
      required: {
        name: true,
        email: true
      },
      fields: {},
      okMessage: 'Submit',
      okShow: true,
      cancelShow: true,
      cancelMessage: 'Cancel',
      showSocialLogin: false,
      showForm: true
    }
  };

  // NOTE HTML templates
  // FUTURE Move to separate files and concat
  var templates = {
    message: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-headline"></h2><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div>',
      bar: '<a class="pf-widget-body"></a><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div>',
      button: '<p class="pf-widget-message pf-widget-ok"></p>',
      inline: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div></div></div></div></div>'
    },
    subscription: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-headline"></h2><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div>',
      folding: '<a class="pf-widget-caption"><p class="pf-widget-headline"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-headline"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div>',
      bar: '<div class="pf-widget-body"></div><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><input type="submit" class="pf-widget-btn pf-widget-ok" /></form></div>',
      inline: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div></div></div></div></div>'
    },
    form: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><div class="pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input name="username" type="text"><input name="title" type="text"><input name="email" type="email"><textarea name="message" rows="5"></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button><button class="pf-widget-btn pf-widget-cancel">Cancel</button></form></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-headline"></h2><p class="pf-widget-message"></p><div class="pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input name="username" type="text"><input name="title" type="text"><input name="email" type="email"><textarea name="message" rows="5"></textarea> <button type="submit" class="pf-widget-btn pf-widget-ok">Send</button><button class="pf-widget-btn pf-widget-cancel">Cancel</button></form></div>',
      folding: '<a class="pf-widget-caption"><p class="pf-widget-headline"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-headline"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><div class="pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input name="username" type="text"><\/p><input name="title" type="text"><input name="email" type="email"><textarea  name="message" rows="5"></textarea> <button class="pf-widget-btn pf-widget-cancel">Cancel</button><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button> </form></div>',
      inline: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><div class="pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input name="username" type="text"><input name="title" type="text"><input name="email" type="email"><textarea name="message" rows="5"></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button><button class="pf-widget-btn pf-widget-cancel">Cancel</button></form></div></div></div></div></div>'
    },
    sitegate: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><div class="pf-sitegate-social-plugins pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input class="pf-sitegate-field pf-field-full-width" name="username" type="text"><input class="pf-sitegate-field pf-field-full-width" name="email" type="email"><input class="pf-sitegate-field pf-field-half-width" name="organization" type="text"><input class="pf-sitegate-field pf-field-half-width" name="title" type="text"><div class="pf-sitegate-clear"></div><button type="submit" class="pf-widget-btn pf-widget-ok">Submit</button><button type="reset" class="pf-widget-btn pf-widget-cancel">Cancel</button></form></div></div></div></div></div>',
      inline: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><h2 class="pf-widget-headline"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><div class="pf-sitegate-social-plugins pf-social-login"><p name="fb-login" hidden></p><p name="google-login" hidden><\/p></div><form><input class="pf-sitegate-field pf-field-full-width" name="username" type="text"><input  class="pf-sitegate-field pf-field-full-width" name="email" type="email"><input class="pf-sitegate-field pf-field-half-width" name="organization" type="text"><input class="pf-sitegate-field pf-field-half-width" name="title" type="text"><div class="pf-sitegate-clear"></div><button type="submit" class="pf-widget-btn pf-widget-ok">Submit</button><button type="reset" class="pf-widget-btn pf-widget-cancel">Cancel</button></form></div></div></div></div></div>'
    },
    social: {
      facebookIcon: '<div class="fb-login-button" data-max-rows="1" data-size="large" data-show-faces="false" data-auto-logout-link="true" data-scope="public_profile,email" data-onlogin="window.pathfora.onFacebookSignIn();"></div>',
      googleMeta: '<meta name="google-signin-client_id" content="{{google-clientId}}">',
      googleIcon: '<div id="{{google-btnId}}" class="google-login"></div>'
    }
  };

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
    var groupsSum;
    var groupsSumRatio;
    var i;
    var j;

    j = arguments.length;
    for (i = 0; i < j; i++) {
      groups.push(arguments[i]);
    }

    groupsSum = groups.reduce(function (sum, element) {
      return sum + element;
    });

    // NOTE If groups collapse into a number greater than 1, normalize
    if (groupsSum > 1) {
      groupsSumRatio = 1 / groupsSum;

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
    var head;
    var link;

    head = document.getElementsByTagName('head')[0];
    link = document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '//c.lytics.io/static/pathfora.min.css');

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
      var cookies = document.cookie;
      var findCookieRegexp = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

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
      var date;

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
      var makeNew = true;
      var subject;

      // make sure our scaffold is valid
      if(!config.target){
        throw new Error('Invalid scaffold. No target array.');
      }
      if(!config.exclude){
        throw new Error('Invalid scaffold. No exclude array.');
      }
      if(!config.inverse){
        throw new Error('Invalid scaffold. No inverse array.');
      }

      if (method === "target"){
        subject = config.target;
      }else if(method === "exclude"){
        subject = config.exclude;
      }else{
        throw new Error('Invalid method (' + method + ').');
      }

      for (var i = 0; i < subject.length; i++) {
        var wgt = subject[i];

        if (wgt.segment === segment){
            wgt.widgets.push(widget);
            makeNew  = false;
        }
      }

      if(makeNew){
          subject.push({
              'segment': segment,
              'widgets': [widget]
          });
      }
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
    watchers: [],
    expiration: null,
    valid: true,
    pageViews: ~~utils.readCookie('PathforaPageView'),

    /**
     * @description Display a single widget
     *              or register a handler for displaying it later
     * @param {object} widget
     */
    initializeWidget: function (widget) {
      var condition = widget.displayConditions;
      var watcher;
      core.valid = true;

      // NOTE Default cookie expiration is one year from now
      core.expiration = new Date();
      core.expiration.setDate(core.expiration.getDate() + 365);

      if (widget.pushDown) {
        if (widget.layout === 'bar' && (widget.position === "top-fixed" || widget.position === "top-absolute")) {
          utils.addClass(document.querySelector(widget.pushDown), "pf-push-down");
        } else {
          throw new Error('Only top positioned bar widgets may have a pushDown property');
        }
      }

      if (condition.date) {
        core.valid = core.valid && core.dateChecker(condition.date, widget);
      }

      if (condition.displayWhenElementVisible) {
        watcher = core.registerElementWatcher(condition.displayWhenElementVisible, widget);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers, widget);
      }

      if (condition.scrollPercentageToDisplay) {
        watcher = core.registerPositionWatcher(condition.scrollPercentageToDisplay, widget);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers, widget);
      }

      if (condition.pageVisits) {
        core.valid = core.valid && core.pageVisitsChecker(condition.pageVisits, widget);
      }

      if (condition.hideAfterAction) {
        core.valid = core.valid && core.hideAfterActionChecker(condition.hideAfterAction, widget);
      }
      if (condition.urlContains) {
        core.valid = core.valid && core.urlChecker(condition.urlContains, widget);
      }

      core.valid = core.valid && condition.showOnInit;

      if (core.watchers.length === 0) {
        if (condition.impressions) {
          core.valid = core.valid && core.impressionsChecker(condition.impressions, widget);
        }

        if (core.valid) {
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
    initializeScrollWatchers: function (watchers, widget) {
      if (!core.scrollListener) {
        core.scrollListener = function () {
          var key;
          var valid;

          for (key in watchers) {
            if (watchers.hasOwnProperty(key) && watchers[key] !== null) {
              valid = core.valid && watchers[key].check();
            }
          }

          if (widget.displayConditions.impressions && valid) {
            valid = core.impressionsChecker(condition.impressions, widget);
          }

          if (valid) {
            context.pathfora.showWidget(widget);
          }
        };
        // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
        if (typeof context.addEventListener === 'function') {
          context.addEventListener('scroll', core.scrollListener, false);
        } else {
          context.onscroll = core.scrollListener;
        }
      }
      return true;
    },

    pageVisitsChecker: function (pageVisitsRequired, widget) {
      return (core.pageViews >= pageVisitsRequired);
    },


    urlChecker: function (phrases, widget) {
      var url = window.location.href;
      var valid = false;

      if (!(phrases instanceof Array)) {
        phrases = Object.keys(phrases).map(function (key) {
          return phrases[key];
        });
      }

      // array of urlContains params is an or list, so if any are true
      // evaluate valid to true
      if (phrases.indexOf('*') === -1) {
        phrases.forEach(function (phrase) {
          if (url.indexOf(phrase) !== -1) {
            valid = true;
          }
        });
      }else{
        valid = true;
      }

      return valid;
    },

    dateChecker: function (date, widget) {
      var valid = true;
      var today = Date.now();

      if (date['start_at'] && today < new Date(date['start_at']).getTime()) {
        valid = false;
      }

      if (date['end_at'] && today > new Date(date['end_at']).getTime()) {
        valid = false;
      }

      return valid;
    },

    impressionsChecker: function (impressionConstraints, widget) {
      var valid = true,
          id = 'PathforaImpressions_' + widget.id,
          sessionImpressions = ~~sessionStorage.getItem(id),
          total = utils.readCookie(id),
          now = Date.now(),
          parts,
          totalImpressions;

      if (!sessionImpressions) {
        sessionImpressions = 1;
      } else {
        sessionImpressions += 1;
      }

      if (!total) {
        totalImpressions = 1;
      } else {
        parts = total.split("|"),
        totalImpressions = parseInt(parts[0]) + 1;
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? total.split(",") : parts;

        if (typeof parts[1] !== "undefined" && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
          valid = false;
        }
      }

      if (sessionImpressions > impressionConstraints.session || totalImpressions > impressionConstraints.total) {
        valid = false;
      }


      if (valid && core.valid) {
        sessionStorage.setItem(id, sessionImpressions);
        utils.saveCookie(id, Math.min(totalImpressions, 9998) + "|" + now, core.expiration);
      }

      return valid;
    },

    hideAfterActionChecker: function (hideAfterActionConstraints, widget) {
      var valid = true,
          now = Date.now(),
          confirm = utils.readCookie('PathforaConfirm_' + widget.id),
          cancel = utils.readCookie('PathforaCancel_' + widget.id),
          closed = utils.readCookie('PathforaClosed_' + widget.id);

      if (hideAfterActionConstraints.confirm && confirm) {
        var parts = confirm.split("|");
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? confirm.split(",") : parts;

        if (parseInt(parts[0]) >= hideAfterActionConstraints.confirm.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== "undefined" && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.confirm.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.cancel && cancel) {
        var parts = cancel.split("|");
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? cancel.split(",") : parts;

        if (parseInt(parts[0]) >= hideAfterActionConstraints.cancel.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== "undefined" && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.cancel.duration) {
          valid = false;
        }
      }

      if (hideAfterActionConstraints.closed && closed) {
        var parts = closed.split("|");
        // NOTE Retain support for cookies with comma - can remove on 5/2/2016
        parts = parts.length === 1 ? closed.split(",") : parts;

        if (parseInt(parts[0]) >= hideAfterActionConstraints.closed.hideCount) {
          valid = false;
        }

        if (typeof parts[1] !== "undefined" && (Math.abs(parts[1] - now) / 1000) < hideAfterActionConstraints.closed.duration) {
          valid = false;
        }
      }

      return valid;
    },

    /**
     * @description Take array of watchers and clear it
     * @param {array} watchers
     */
    removeScrollWatchers: function (watchers) {
      watchers.forEach(function (watcher) {
        core.removeWatcher(watcher);
      });

      context.removeEventListener('scroll', core.scrollListener, false);
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
     * @description Register a scroll position-triggered widget
     * @param   {number} percent scroll percentage at
     *                   which the widget should be displayed
     * @param   {object} widget
     * @returns {object} object, containing onscroll callback function 'check'
     */
    registerPositionWatcher: function (percent, widget) {
      var watcher = {
        check: function () {
          var positionInPixels = (document.body.offsetHeight - window.innerHeight) * percent / 100;
          var offset = document.documentElement.scrollTop || document.body.scrollTop;
          if (offset >= positionInPixels) {
            core.removeWatcher(watcher);
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
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;
          if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
            core.removeWatcher(watcher);
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
    removeWatcher: function (watcher) {
      var key;

      for (key in core.watchers) {
        if (core.watchers.hasOwnProperty(key) && watcher === core.watchers[key]) {
          core.watchers.splice(key, 1);
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
      var widgetCancel = widget.querySelector('.pf-widget-cancel');
      var widgetOk = widget.querySelector('.pf-widget-ok');
      var widgetForm = widget.querySelector('form');
      var widgetHeadline = widget.querySelectorAll('.pf-widget-headline');
      var widgetBody = widget.querySelector('.pf-widget-body');
      var widgetMessage = widget.querySelector('.pf-widget-message');
      var widgetClose = widget.querySelector('.pf-widget-close');
      var widgetTextArea;
      var widgetImage;
      var node;
      var i;

      if (widgetCancel !== null && !config.cancelShow || config.layout === 'inline') {
        node = widgetCancel;

        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }

      if (config.layout === 'inline') {
        node = widgetClose;

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

      if(widgetCancel !== null) {
        widgetCancel.innerHTML = config.cancelMessage;
      }

      if(widgetOk !== null) {
        widgetOk.innerHTML = config.okMessage;
      }

      if(widgetOk && widgetOk.value !== null) {
        widgetOk.value = config.okMessage;
      }

      if(widgetCancel && widgetCancel.value !== null) {
        widgetCancel.value = config.cancelMessage;
      }

      switch (config.type) {
      case 'form':
        switch (config.layout) {
        case 'folding':
        case 'modal':
        case 'slideout':
        case 'random':
        case 'inline':
          core.autoCompleteFacebookData();
          core.autoCompleteGoogleData();
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
        case 'inline':
          if (config.showForm === false) {
            node = widget.querySelector('form');

            if (node) {
              node.className += ' pf-hidden';
            }

            node = widget.querySelector('.pf-sitegate-centered-label');

            if (node.parentNode) {
              node.parentNode.removeChild(node);
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
          widgetImage = document.createElement('img');
          widgetImage.src = config.image;
          widgetImage.className = 'pf-widget-img';
          widgetBody.appendChild(widgetImage);
        }
      } else {
        utils.addClass(widget, 'pf-no-img');
      }

      switch(config.type) {
      case 'sitegate':
      case 'form':

        if (config.showSocialLogin === false) {
          node = widget.querySelector('.pf-social-login');

          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        } else {
          core.autoCompleteFacebookData();
          core.autoCompleteGoogleData();
        }

        var getFormElement = function(field) {
          if (field === "message")
            return widget.querySelector('textarea');
          else if (field === "name")
            return widget.querySelector('input[name="username"]');
          return widget.querySelector('input[name="' + field + '"]');
        }


        // Set placeholders
        Object.keys(config.placeholders).forEach(function (field) {
          var element = getFormElement(field);

          if (element && typeof element.placeholder !== "undefined") {
            element.placeholder = config.placeholders[field];
          }
        });

        // Set required Fields
        Object.keys(config.required).forEach(function (field) {
          var element = getFormElement(field);

          if (element && config.required[field]) {
            element.setAttribute('required', '');
          }
        });

        // Hide fields
        Object.keys(config.fields).forEach(function (field) {
          var element = getFormElement(field);

          if (element && !config.required[field] && !config.fields[field]) {
            var parent = element.parentNode;
            if (parent) {
              parent.removeChild(element);
            }
          }
        });
        break;
      case 'subscription':
        widget.querySelector('input').placeholder = config.placeholders.email;
        break;
      }

      if(config.msg){
        widgetMessage.innerHTML = config.msg;
      }
    },

    /**
     * @description Append event handlers to the widget
     * @param {object} widget
     * @param {object} config
     */
    constructWidgetActions: function (widget, config) {
      var widgetOk = widget.querySelector('.pf-widget-ok');
      var widgetAllCaptions;
      var widgetFirstCaption;
      var widgetCancel;
      var widgetClose;
      var widgetForm;
      var widgetOnFormSubmit;
      var widgetOnButtonClick;
      var widgetOnModalClose;
      var updateActionCookie;
      var cancelShouldClose = true;
      var i;
      var j;

      switch (config.type) {
      case 'form':
      case 'sitegate':
        widgetForm = widget.querySelector('form');
        widgetOnFormSubmit = function (event) {
          var widgetAction;

          event.preventDefault();

          switch(config.type) {
          case 'form':
            widgetAction = 'submit';
            break;
          case 'subscription':
            widgetAction = 'subscribe';
            break;
          case 'sitegate':
            widgetAction = 'unlock';
            cancelShouldClose = false;
            break;
          }

          if (widgetAction) {
            core.trackWidgetAction(widgetAction, config, event.target);
          }

          if (typeof config.onSubmit === 'function') {
            config.onSubmit(callbackTypes.FORM_SUBMIT, {
              widget: widget,
              event: event,
              data: Array.prototype.slice.call(
                widgetForm.querySelectorAll('input, textarea')
              ).map(function (element) {
                return {
                  name: element.name || element.id,
                  value: element.value
                };
              })
            });
          }
        };

        if (widgetForm.addEventListener) {
          widgetForm.addEventListener('submit', widgetOnFormSubmit);
        } else {
          widgetForm.attachEvent('submit', widgetOnFormSubmit);
        }
        break;
      }

      switch (config.layout) {
      case 'folding':
        cancelShouldClose = false;
        widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left');
        widgetFirstCaption = widget.querySelector('.pf-widget-caption');

        if (config.position !== 'left') {
          setTimeout(function () {
            var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
            widget.style.bottom = -height + 'px';
          }, 0);
        }

        j = widgetAllCaptions.length - 1;
        for (i = j; i >= 0; i--) {
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
        widgetCancel = widget.querySelector('.pf-widget-cancel');
        widgetClose = widget.querySelector('.pf-widget-close');
        widgetOnModalClose = function (event) {
          if (typeof config.onModalClose === 'function') {
            config.onModalClose(callbackTypes.MODAL_CLOSE, {
              widget: widget,
              event: event
            });
          }
        };

        updateActionCookie = function (name) {
          var val = utils.readCookie(name),
              duration = Date.now(),
              ct;

          if (val) {
            val = val.split("|");
            // NOTE Retain support for cookies with comma - can remove on 5/2/2016
            val = val.length === 1 ? val.split(",") : val;
            ct = Math.min(parseInt(val[0]), 9998) + 1;
          } else {
            ct = 1;
          }

          utils.saveCookie(name, ct + "|" + duration, core.expiration);
        };

        if (widgetClose) {
          widgetClose.onclick = function (event) {
            context.pathfora.closeWidget(widget.id);
            updateActionCookie("PathforaClosed_" + widget.id);
            widgetOnModalClose(event);
          };
        }

        if (widgetCancel) {
          if (typeof config.cancelAction === 'object') {
            widgetCancel.onclick = function (event) {
              core.trackWidgetAction('cancel', config);
              if (typeof config.cancelAction.callback === 'function') {
                config.cancelAction.callback();
              }
              if (widgetCancel.type !== "reset") {
                context.pathfora.closeWidget(widget.id, true);
              }
              updateActionCookie("PathforaCancel_" + widget.id);
              widgetOnModalClose(event);
            };
          } else {
            widgetCancel.onclick = function (event) {
              core.trackWidgetAction('cancel', config);
              if (widgetCancel.type !== "reset") {
                context.pathfora.closeWidget(widget.id);
              }
              updateActionCookie("PathforaCancel_" + widget.id);
              widgetOnModalClose(event);
            };
          }
        }
      default:
        break;
      }

      if (typeof config.confirmAction === 'object') {
        widgetOk.onclick = function () {
          core.trackWidgetAction('confirm', config);
          if (typeof updateActionCookie === 'function') {
            updateActionCookie("PathforaConfirm_" + widget.id);
          }
          if (typeof config.confirmAction.callback === 'function') {
            config.confirmAction.callback();
          }
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }
          if (typeof widgetOnModalClose === 'function') {
            widgetOnModalClose(event);
          }

          if (config.layout !== 'inline') {
            context.pathfora.closeWidget(widget.id, true);
          }
        };
      } else if (config.type === 'message') {
        widgetOk.onclick = function () {
          core.trackWidgetAction('confirm', config);
          if (typeof updateActionCookie === 'function') {
            updateActionCookie("PathforaConfirm_" + widget.id);
          }
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }
          if (config.layout !== 'inline') {
            context.pathfora.closeWidget(widget.id);
          }
        };
      } else if (config.type === 'form' || config.type === 'sitegate') {
        widgetOk.onclick = function () {
          var valid = true;

          Array.prototype.slice.call(
            widget.querySelectorAll('input, textarea')
          ).forEach(function (inputField) {
            if (inputField.hasAttribute('required') && !inputField.value) {
              valid = false;
            }
          });

          if (valid) {
            if (typeof updateActionCookie === 'function') {
              updateActionCookie("PathforaConfirm_" + widget.id);
            }
            if (typeof widgetOnModalClose === 'function') {
              widgetOnModalClose(event);
            }

            if (config.layout !== 'inline') {
              context.pathfora.closeWidget(widget.id);
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
      var colors = {};

      if (typeof config.theme === 'undefined') {
        core.setCustomColors(widget, defaultProps.generic.themes['default']);
      }

      if(config.config && config.config.theme === null) {
        core.updateObject(colors, defaultProps.generic.themes['default']);
        core.updateObject(colors, config.config.colors);
        core.setCustomColors(widget, colors);
      } else if (config.themes) {
        if (config.theme === 'custom') {

          // NOTE custom colors
          core.updateObject(colors, config.colors);
        } else if (config.theme === 'default' && defaultProps.generic.theme !== 'default') {

          // NOTE colors set via the higher config
          if (defaultProps.generic.theme === 'custom') {
            core.updateObject(colors, defaultProps.generic.colors);
          } else {
            core.updateObject(colors, defaultProps.generic.themes[defaultProps.generic.theme]);
          }
        } else {

          // NOTE default theme
          core.updateObject(colors, defaultProps.generic.themes[config.theme]);
        }

        core.setCustomColors(widget, colors);
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

      ].join('');
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

      this.setupWidgetPosition(widget, config);
      this.constructWidgetActions(widget, config);
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
      var close = widget.querySelector('.pf-widget-close');
      var headline = widget.querySelector('.pf-widget-headline');
      var headlineLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-headline');
      var cancelBtn = widget.querySelector('.pf-widget-cancel');
      var okBtn = widget.querySelector('.pf-widget-ok');
      var arrow = widget.querySelector('.pf-widget-caption span');
      var arrowLeft = widget.querySelector('.pf-widget-caption-left span');
      var fields = widget.querySelectorAll('input, textarea');
      var i;
      var j;

      if (utils.hasClass(widget, 'pf-widget-modal')) {
        widget.querySelector('.pf-widget-content').style.backgroundColor = colors.background;
      } else {
        widget.style.backgroundColor = colors.background;
      }

      if (fields.length > 0) {
        j = fields.length;
        for (i = 0; i < j; i++) {
          fields[i].style.backgroundColor = colors.fieldBackground;
        }
      }

      if (close) {
        close.style.color = colors.close;
      }

      if (headline) {
        headline.style.color = colors.headline;
      }

      if (headlineLeft) {
        headlineLeft.style.color = colors.headline;
      }

      if (arrow) {
        arrow.style.color = colors.close;
      }

      if (arrowLeft) {
        arrowLeft.style.color = colors.close;
      }

      if (cancelBtn) {
        cancelBtn.style.color = colors.cancelText;
        cancelBtn.style.backgroundColor = colors.cancelBackground;
      }

      if (okBtn) {
        okBtn.style.color = colors.actionText;
        okBtn.style.backgroundColor = colors.actionBackground;
      }

      widget.querySelector('.pf-widget-message').style.color = colors.text;
    },

    /**
     * @description Report data related to the user action with widget
     * @list  actions   [close, show, confirm, cancel, submit, subscribe]
     * @param {string}  action      action name
     * @param {object}  widget      related widget
     * @param {Element} htmlElement related DOM element
     */
    trackWidgetAction: function (action, widget, htmlElement) {
      var params = {
        'pf-widget-id': widget.id,
        'pf-widget-type': widget.type,
        'pf-widget-layout': widget.layout,
        'pf-widget-variant': widget.variant
      };
      var valid = true;

      switch (action) {
      case 'show':
        pathforaDataObject.displayedWidgets.push(params);
        break;
      case 'close':
        pathforaDataObject.closedWidgets.push(params);
        break;
      case 'confirm':
        params['pf-widget-action'] = !!widget.confirmAction && widget.confirmAction.name || "default confirm";
        pathforaDataObject.completedActions.push(params);
        break;
      case 'cancel':
        params['pf-widget-action'] = !!widget.cancelAction && widget.cancelAction.name || "default cancel";
        pathforaDataObject.cancelledActions.push(params);
        break;
      case 'submit':
        for (var elem in htmlElement.children) {
          var child = htmlElement.children[elem];
          if(typeof child.getAttribute !== "undefined" && child.getAttribute("name") !== null) {
            var childName = child.getAttribute("name");
            params['pf-form-' + childName] = child.value;
          }
        }
        break;
      case 'subscribe':
        params['pf-form-email'] = htmlElement.elements['email'].value;
      case 'unlock':
        for (var elem in htmlElement.children) {
          var child = htmlElement.children[elem];
          if(typeof child.getAttribute !== "undefined" && child.getAttribute("name") !== null) {
            var childName = child.getAttribute("name");
            params['pf-form-' + childName] = child.value;
          }

          if (typeof child.hasAttribute !== "undefined" && child.hasAttribute('required') && !params['pf-form-' + childName]) {
            child.setAttribute('invalid', '');
            valid = false;
          }
        }
        utils.saveCookie('PathforaUnlocked', valid, core.expiration);
      }

      params['pf-widget-event'] = action;
      if (valid === true) {
        api.reportData(params);
      }
    },

    /**
     * @description Override object with new config parameters
     * @param {object} object original object
     * @param {object} config new configuration
     */
    updateObject: function (object, config) {
      var prop;

      for (prop in config) {
        if (typeof config[prop] === 'object' && config[prop] !== null) {
          if(config.hasOwnProperty(prop)) {
            if(typeof object[prop] === 'undefined') {
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
      var widgetOnInitCallback;
      var defaults;
      var globals;
      var widget;
      var i;
      var j;

      j = array.length;
      for (i = 0; i < j; i++) {
        widget = array[i];
        if (!widget || !widget.config) {
          continue;
        }

        widgetOnInitCallback = widget.config.onInit;
        defaults = defaultProps[widget.type];
        globals = defaultProps.generic;

        if (widget.type === 'sitegate' && utils.readCookie('PathforaUnlocked') === 'true' || widget.hiddenViaABTests === true) {
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

        if (widget.displayConditions.showDelay) {
          core.registerDelayedWidget(widget);
        } else {
          core.initializeWidget(widget);
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
      var i;
      var j;

      if (!widgets) {
        throw new Error('Widgets not specified');
      }

      if (!(widgets instanceof Array) && widgets.target) {
        j = widgets.target.length;

        widgets.common = widgets.common || [];

        for (i = 0; i < j; i++) {
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
      var widget = {};
      var props;
      var random;

      if (!config) {
        throw new Error('Config object is missing');
      }

      if(config.layout === 'random') {
        props = {
          layout: ['modal', 'slideout', 'bar', 'folding'],
          variant: ['1', '2'],
          slideout: ['bottom-left', 'bottom-right'],
          bar: ['top-absolute', 'top-fixed', 'bottom-fixed'],
          folding: ['left', 'bottom-left', 'bottom-right']
        };

        // FIXME Hard coded magical numbers, hard coded magical numbers everywhere :))
        switch(type) {
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

      if (!config.id &&
           config.displayConditions &&
           typeof config.displayConditions.impressions !== 'undefined') {
        delete config.displayConditions.impressions;

        throw new Error('Widgets with the impression displayConditions need a preset id value. Display condition denied.');
      }

      if (!config.id &&
           config.displayConditions &&
           typeof config.displayConditions.hideAfterAction !== 'undefined') {
        delete config.displayConditions.hideAfterAction;

        throw new Error('Widgets with the hideAfterAction displayConditions need a preset id value. Display condition denied.');
      }

      widget.id = config.id || utils.generateUniqueId();

      return widget;
    },

    prepareABTest: function (config) {
      var test = {};

      if (!config) {
        throw new Error('Config object is missing');
      }

      test.id = config.id;
      test.cookieId = abHashMD5 + config.id;
      test.groups = config.groups;

      if (!abTestingTypes[config.type]) {
        throw new Error('Unknown AB testing type: ' + config.type);
      }

      test.type = abTestingTypes[config.type];

      return test;
    },

    /**
     * @description Social APIs require certain DOM elements to be redrawn
     *                  after initialization (ex. buttons). Request a timeout
     *                  redraw, which executes after all social APIs are initialized.
     *                  Generates a clojure function inside.
     */
    requestSocialPluginRender: function () {
      var renderWidgets = {
        facebook: [],
        google: []
      };
      var timeoutInterval = {};

      var attemptRenderingFacebook = function () {
        if (typeof window.FB !== 'undefined' && typeof window.FB.XFBML.parse === 'function') {
          renderWidgets.facebook.forEach(function (widget) {
            var signInBtn = widget.querySelector('.fb-login-button');

            window.FB.XFBML.parse(widget);
            signInBtn.className += ' social-login-btn';
          });
          renderWidgets.facebook = [];
          core.autoCompleteFacebookData();

          return clearTimeout(timeoutInterval['fb']);
        } else {
          return setTimeout(attemptRenderingFacebook, 1000);
        }
      };

      var attemptRenderingGoogle = function () {
        if (typeof window.gapi !== 'undefined') {
          renderWidgets.google.forEach(function (widget) {
            var signInBtn = widget.querySelector('.google-login');

            window.gapi.signin2.render(signInBtn.id, {
              scope: 'profile',
              onsuccess: pathfora.onGoogleSignIn,
              height: 25,
              width: 90,
              longtitle: false
            });
            signInBtn.className += ' social-login-btn';
          });
          renderWidgets.google = [];

          return clearTimeout(timeoutInterval['google']);
        } else {
          return setTimeout(attemptRenderingGoogle, 1000);
        }
      };

      this.requestSocialPluginRender = function (widget) {
        var widgets = widget instanceof Array ? widget : [widget];

        widgets.forEach(function (element) {
          var requestFacebook = false;
          var requestGoogle = false;

          if (typeof element.querySelector === 'undefined') {
            return false;
          }

          requestFacebook = element.querySelector('.fb-login-button') !== null;
          requestGoogle = element.querySelector('.google-login') !== null;

          if (requestFacebook) {
            renderWidgets.facebook = renderWidgets.facebook.concat(element);
          }
          if (requestGoogle) {
            renderWidgets.google = renderWidgets.google.concat(element);
          }
        });

        timeoutInterval['fb'] = attemptRenderingFacebook();
        timeoutInterval['google'] = attemptRenderingGoogle();
      };

      this.requestSocialPluginRender(arguments[0]);
    },

    /**
     * @description Attempt to load forms' data from Facebook API.
     * @throws {Error} Facebook API Error
     */
    autoCompleteFacebookData: function () {
      if (typeof window.FB !== 'undefined') {
        window.FB.getLoginStatus(function (connection) {
          if (connection.status === 'connected') {
            window.FB.api('/me', {
              fields: 'name,first_name,last_name,email'
            }, function (query) {
              if (query.error) {
                throw new Error('Facebook API Error: ' + query.error);
              }

              core.autoCompleteFormFields({
                username: query.name || '',
                email: query.email || '',
                firstName: query.first_name || '',
                lastName: query.last_name || ''
              });
            });
          }
        });
      }
    },

    /**
     * @description Attempt to load forms' data from Google+ API.
     */
    autoCompleteGoogleData: function () {
      var auth2;
      var user;
      if (typeof window.gapi !== 'undefined' && typeof window.gapi.auth2 !== 'undefined') {
        auth2 = window.gapi.auth2.getAuthInstance();
        user = auth2.currentUser.get().getBasicProfile();

        if (typeof user !== 'undefined') {
          core.autoCompleteFormFields({
            username: user.getName() || '',
            email: user.getEmail() || '',
            firstName: '',
            lastName: ''
          });
        }
      }
    },

    /**
     * @description Fill form DOM objects with user data
     * @param {object} data user data
     */
    autoCompleteFormFields: function (data) {
      var widgets = Array.prototype.slice.call(document.querySelectorAll('.pf-widget-content'));

      widgets.forEach(function (widget) {
        Object.keys(data).forEach(function (inputField) {
          var field = widget.querySelector('input[name="' + inputField + '"]');

          if (field && !field.value) {
            field.value = data[inputField];
          }
        });
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
      xhr.setRequestHeader('Accept','application/json');
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
     * @throws {Error} error
     * @param {string} accountId  Lytics user ID
     * @param {string} callback   universal callback
     */
    checkUserSegments: function (accountId, callback) {
      var seerId = utils.readCookie('seerid');
      var apiUrl;

      if (!seerId) {
        throw new Error('Cannot find SEERID cookie');
      }

      apiUrl = [
        '//api.lytics.io/api/me/',
        accountId,
        '/',
        seerId,
        '?segments=true'
      ].join('');

      this.getData(apiUrl, function (response) {
        callback(JSON.parse(response).data.segments);

      }, function () {
        callback({
          data: {
            segments: ['all']
          }
        });
      });
    }
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
    this.version = '0.0.1';

    this.initializePageViews = function () {
      var cookie = utils.readCookie('PathforaPageView');
      var date = new Date();
      date.setDate(date.getDate() + 365);
      utils.saveCookie('PathforaPageView', Math.min(~~cookie, 9998) + 1, date);
    };

    /**
     * @public
     * @description Initialize Pathfora widgets from a container
     * @param {object|array}   widgets
     * @param {string}         lyticsId
     * @param {object}         config
     */
    this.initializeWidgets = function (widgets, lyticsId, config) {
      // NOTE IE < 10 not supported
      // FIXME Why? 'atob' can be polyfilled, 'all' is not necessary anymore?
      if (document.all && !context.atob) {
        return;
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
          api.checkUserSegments(lyticsId, function (segments) {

            var target,
              targetmatched = false,
              targetedwidgets = [],
              ti,
              tl,
              exclude,
              excludematched = false,
              confirmedwidgets = [],
              ei,
              ex,
              ey,
              el;

            // handle inclusions
            if(widgets.target){
              tl = widgets.target.length;
              for (ti = 0; ti < tl; ti++) {
                target = widgets.target[ti];
                if (segments && segments.indexOf(target.segment) !== -1) {
                  targetedwidgets = target.widgets;
                }
              }
            }

            // handle exclusions
            if(widgets.exclude){
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
        var abTestingType = abTest.type;
        var userAbTestingValue = utils.readCookie(abTest.cookieId);
        var userAbTestingGroup = 0;
        var i;

        if (!userAbTestingValue) {
          userAbTestingValue = Math.random();
        }

        // NOTE Always update the cookie to get the new exp date.
        var date = new Date();
        date.setDate(date.getDate() + 365);
        utils.saveCookie(abTest.cookieId, userAbTestingValue, date);

        // NOTE Determine visible group for the user
        i = 0;
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
      var i;
      var j;
      var node;
      var hostNode;

      // FIXME Change to Array#filter and Array#length
      j = core.openedWidgets.length;
      for (i = 0; i < j; i++) {
        if (core.openedWidgets[i] === widget) {
          return;
        }
      }

      core.openedWidgets.push(widget);
      core.trackWidgetAction('show', widget);

      node = core.createWidgetHtml(widget);

      if (widget.showSocialLogin)
        core.requestSocialPluginRender(node);

      if (widget.pushDown) {
        utils.addClass(document.querySelector('.pf-push-down'), "opened");
      }

      if (widget.config.layout !== 'inline') {
        document.body.appendChild(node);
      } else {
        hostNode = document.querySelector(widget.config.position);

        if (hostNode) {
          hostNode.appendChild(node);
        } else {
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
          context.pathfora.closeWidget(widget.id);
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
      var i;
      var j;
      var node;

      // FIXME Change to Array#some or Array#filter
      j = core.openedWidgets.length;
      for (i = 0; i < j; i++) {
        if (core.openedWidgets[i].id === id) {
          if (!noTrack) {
            core.trackWidgetAction('close', core.openedWidgets[i]);
          }
          core.openedWidgets.splice(i, 1);
          break;
        }
      }

      node = document.getElementById(id);
      utils.removeClass(node, 'opened');

      if (utils.hasClass(node, 'pf-has-push-down')) {
        var pushDown = document.querySelector('.pf-push-down');
        if (pushDown)
          utils.removeClass(pushDown, "opened");
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
      var opened = core.openedWidgets;
      var delayed = core.delayedWidgets;
      var element;
      var i;

      opened.forEach(function (widget) {
        element = document.getElementById(widget.id);
        utils.removeClass(element, 'opened');
        element.parentNode.removeChild(element);
      });

      opened.slice(0);

      i = delayed.length;
      for (i; i > -1; i--) {
        core.cancelDelayedWidget(delayed[i]);
      }

      core.openedWidgets = [];
      core.initializedWidgets = [];
      core.removeScrollWatchers(core.watchers);

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
      // FUTURE Combine with Google integration and move to utils
      var parseFBLoginTemplate = function (parentTemplates) {
        Object.keys(parentTemplates).forEach(function (type) {
          parentTemplates[type] = parentTemplates[type].replace(
            /<p name="fb-login" hidden><\/p>/gm,
            templates.social.facebookIcon
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
      };

      // NOTE API initialization
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

      parseFBLoginTemplate(templates.form);
      parseFBLoginTemplate(templates.sitegate);

      pathforaDataObject.socialNetworks.facebookAppId = appId;
    };

    /**
     * @public
     * @description Integrate with Google App API
     * @param {string} clientId
     */
    this.integrateWithGoogle = function (clientId) {
      var body = document.querySelector('body');
      var head = document.querySelector('head');

      var appMetaTag = templates.social.googleMeta.replace(
        /(\{){2}google-clientId(\}){2}/gm,
        clientId
      );

      var parseGoogleLoginTemplate = function (parentTemplates) {
        Object.keys(parentTemplates).forEach(function (type, index) {
          parentTemplates[type] = parentTemplates[type].replace(
            /<p name="google-login" hidden><\/p>/gm,
            templates.social.googleIcon.replace(
              /(\{){2}google-btnId(\}){2}/gm,
              'g-' + index
            )
          );
        });
      };

      head.innerHTML += appMetaTag;


      // NOTE Google API
      (function () {
        var s;
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
      })();

      pathforaDataObject.socialNetworks.googleClientID = clientId;
      parseGoogleLoginTemplate(templates.form);
      parseGoogleLoginTemplate(templates.sitegate);
    };

    this.onFacebookSignIn = function () {
      core.autoCompleteFacebookData();
    };

    this.onGoogleSignIn = function (googleData) {
      core.autoCompleteGoogleData(googleData);
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
  };

  // NOTE Initialize context
  appendPathforaStylesheet();
  context.pathfora = new Pathfora();
  context.pathfora.initializePageViews();

  // NOTE Webadmin generated config
  if (typeof pfCfg === 'object') {

    api.getData([
      document.location.protocol === 'https:' ? 'https' : 'http',
      '://pathfora.parseapp.com/config/',
      pfCfg.uid,
      '/',
      pfCfg.pid
    ].join(''),
    function (data) {
      var parsed = JSON.parse(data);
      var widgets = parsed.widgets;
      var themes = {};
      var widgetsConfig;
      var prepareWidgetArray;
      var i;
      var j;

      if (typeof parsed.config.themes !== 'undefined') {
        j = parsed.config.themes.length;
        for (i = 0; i < j; i++) {
          themes[parsed.config.themes[i].name] = parsed.config.themes[i].colors;
        }
      }

      widgetsConfig = {
        generic: {
          themes: themes
        }
      };

      prepareWidgetArray = function (array) {
        j = array.length;
        for (i = 0; i < j; i++) {
          array[i] = core.prepareWidget(array[i].type, array[i]);
        }
      };
      prepareWidgetArray(widgets.common);

      j = widgets.target.length;
      for (i = 0; i < j; i++) {
        prepareWidgetArray(widgets.target[i].widgets);
      }

      context.pathfora.initializeWidgets(widgets, pfCfg.lid, widgetsConfig);
    });
  }
})(window, document);