/* global jstag, pfCfg */
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
    slideout: 'left',
    button: 'top-left',
    bar: 'top-fixed',
    folding: 'bottom-left'
  };
  var defaultProps = {
    generic: {
      className: 'pathfora',
      header: '',
      theme: 'default',
      themes: {
        default: {
          background: '#ddd',
          header: '#333',
          text: '#333',
          close: '#999',
          actionText: '#333',
          actionBackground: '#eee',
          cancelText: '#333',
          cancelBackground: '#eee'
        },
        dark: {
          background: '#333',
          header: '#fff',
          text: '#fff',
          close: '#888',
          actionText: '#fff',
          actionBackground: '#597E9B',
          cancelText: '#fff',
          cancelBackground: '#597E9B'
        },
        light: {
          background: '#ddd',
          header: '#333',
          text: '#333',
          close: '#999',
          actionText: '#333',
          actionBackground: '#eee',
          cancelText: '#333',
          cancelBackground: '#eee'
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
      cancelButton: true,
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
        message: 'Message'
      },
      okMessage: 'Send',
      cancelMessage: 'Cancel',
      okShow: true,
      cancelShow: true
    }
  };

  // NOTE HTML templates
  // FUTURE Move to separate files and concat
  var templates = {
    message: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-cancel">Cancel</a><a class="pf-widget-btn pf-widget-ok">Confirm</a></div>',
      bar: '<a class="pf-widget-body"></a><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div>',
      button: '<p class="pf-widget-message pf-widget-ok"></p>',
      inline: ''
    },
    subscription: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div>',
      folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><button type="submit" class="pf-widget-btn pf-widget-ok">X</button><span><input name="email" type="email" required></span></form></div>',
      bar: '<div class="pf-widget-body"></div><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><input type="submit" class="pf-widget-btn pf-widget-ok" /></form></div>'
    },
    form: {
      modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea name="message" rows="5" required></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button><button class="pf-widget-btn pf-widget-cancel">Cancel</button> </form></div></div></div></div></div>',
      slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><input name="username" type="text"><input name="title" type="text" required><input name="email" type="email" required><textarea name="message" rows="5" required></textarea> <button class="pf-widget-btn pf-widget-cancel">Cancel</button><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button></form></div>',
      folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea  name="message" rows="5" required></textarea> <button class="pf-widget-btn pf-widget-cancel">Cancel</button><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button> </form></div>'
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
   * @function createABTestingMode
   * @description Create an A/B testing object from groups list
   * @returns {object} A/B testing object instance
   */
  var createABTestingMode = function () {
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

  var abHashMD5 = '187ef4436122d1cc2f40dc2b92f0eba0';
  var abTestingTypes = {
    '100': createABTestingMode(100),
    '50/50': createABTestingMode(120, 80)
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
    abTestingMode: null,
    abTestingGroup: null
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

    // NOTE Need to update the cdn version. For now use local.
    link.setAttribute('href', '//cdn.jsdelivr.net/pathforajs/latest/pathfora.min.css');
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
    saveCookie: function (name, value, days) {
      var expires;
      var date;

      if (days) {
        date = new Date();
        date.setDate(date.getDate() + days);
        expires = '; expires=' + date.toGMTString();
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
    }

    /**
     *
     * @param   {array}  items array of items
     * @returns {object} random item from the array
     */
    // FIXME Unused
    //randomChoice: function (items) {
    //  return items[Math.floor(Math.random() * items.length)];
    //}
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

    /**
     * @description Display a single widget
     *              or register a handler for displaying it later
     * @param {object} widget
     */
    initializeWidget: function (widget) {
      var condition = widget.displayConditions;
      var watcher;
//      var widgetOnInitCallback = widget.config.onInit;

      if (condition.displayWhenElementVisible) {
        watcher = core.registerElementWatcher(condition.displayWhenElementVisible, widget);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers);
      } else if (condition.scrollPercentageToDisplay) {
        watcher = core.registerPositionWatcher(condition.scrollPercentageToDisplay, widget);
        core.watchers.push(watcher);
        core.initializeScrollWatchers(core.watchers);
      } else if (condition.showOnInit) {
        context.pathfora.showWidget(widget);
      }

//    NOTE theoretically onInit should be here, @see comment on initializeWidgetArray
//    FIXME remove one onInit (here or in initializeWidgetArray)
//      if (typeof widgetOnInitCallback === 'function') {
//        widgetOnInitCallback(callbackTypes.INIT, {
//          widget: widget,
//          watcher: watcher,
//          condition: condition
//        });
//      }
    },

    /**
     * @description Take array of scroll aware elements
     *              and check if it should display any
     *              when user is scrolling the page
     * @param {array} watchers
     */
    initializeScrollWatchers: function (watchers) {
      if (!core.scrollListener) {
        core.scrollListener = function () {
          var key;

          for (key in watchers) {
            if (watchers.hasOwnProperty(key) && watchers[key] !== null) {
              watchers[key].check();
            }
          }
        };
        // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
        if (typeof context.addEventListener === 'function') {
          context.addEventListener('scroll', core.scrollListener, false);
        } else {
          context.onscroll = core.scrollListener;
        }
      }
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
            context.pathfora.showWidget(widget);
            core.removeWatcher(watcher);
          }
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
    registerElementWatcher: function (id, widget) {
      var watcher = {
        elem: document.getElementById(id),
        check: function () {
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;
          if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
            context.pathfora.showWidget(widget);
            core.removeWatcher(watcher);
          }
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
      var widgetHeader = widget.querySelectorAll('.pf-widget-header');
      var widgetBody = widget.querySelector('.pf-widget-body');
      var widgetMessage = widget.querySelector('.pf-widget-message');
      var widgetTextArea;
      var widgetImage;
      var node;
      var i;

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
          widgetTextArea = widget.querySelector('textarea');
          // FIXME Cache
          // FIXME (???) Check if can be changed to [input=*] !
          widget.querySelectorAll('input')[0].placeholder = config.placeholders.name;
          widget.querySelectorAll('input')[1].placeholder = config.placeholders.title;
          widget.querySelectorAll('input')[2].placeholder = config.placeholders.email;
          widgetTextArea.placeholder = config.placeholders.message;
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
          // FIXME Cache
          widget.querySelector('input').placeholder = config.placeholders.email;
          break;
        default:
          throw new Error('Invalid widget layout value');
        }
        break;
      case 'message':
        switch (config.layout) {
        case 'modal':
        case 'folding':
        case 'slideout':
        case 'random':
        case 'bar':
        case 'button':
          break;
        default:
          throw new Error('Invalid widget layout value');
        }
      }

      // NOTE Set The header
      for (i = widgetHeader.length - 1; i >= 0; i--) {
        widgetHeader[i].innerHTML = config.header;
      }

      // NOTE Set the image
      if (config.image) {
        if (config.layout === 'button') {
          // FIXME Console in production
          // console.warn('Images are not compatible with the button layout.');
        } else {
          widgetImage = document.createElement('img');
          widgetImage.src = config.image;
          widgetImage.className = 'pf-widget-img';
          widgetBody.appendChild(widgetImage);
        }
      } else {
        utils.addClass(widget, 'pf-no-img');
      }

      // NOTE Set the message
      widgetMessage.innerHTML = config.msg;

      if (config.type === 'form') {
        if (config.nameField === false) {
          // FIXME Cache
          widgetForm.removeChild(widgetForm.querySelector('input[name="username"]'));
        }
        if (config.titleField === false) {
          // FIXME Cache
          widgetForm.removeChild(widgetForm.querySelector('input[name="title"]'));
        }
        if (config.emailField === false) {
          // FIXME Cache
          widgetForm.removeChild(widgetForm.querySelector('input[name="email"]'));
        }
        if (config.msgField === false) {
          // FIXME Cache
          widgetForm.removeChild(widgetForm.querySelector('texarea[name="message"]'));
        }
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
      var i;
      var j;

      switch (config.type) {
      case 'form':
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
        widgetAllCaptions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left');
        widgetFirstCaption = widget.querySelector('.pf-widget-caption');

        if (config.position !== 'left') {
          setTimeout(function () {
            var height = widget.offsetHeight - widgetFirstCaption.offsetHeight;
            widget.style.bottom = -height + 'px';
          }, 0);
        }

        // FIXME Change to forEach
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

        widgetClose.onclick = function (event) {
          context.pathfora.closeWidget(widget.id);
          widgetOnModalClose(event);
        };

        if (widgetCancel) {
          if (typeof config.cancelAction === 'object') {
            widgetCancel.onclick = function (event) {
              core.trackWidgetAction('cancel', config);
              if (typeof config.cancelAction.callback === 'function') {
                config.cancelAction.callback();
              }
              context.pathfora.closeWidget(widget.id, true);
              widgetOnModalClose(event);
            };
          } else {
            widgetCancel.onclick = function (event) {
              context.pathfora.closeWidget(widget.id);
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
          if (typeof config.confirmAction.callback === 'function') {
            config.confirmAction.callback();
          }
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }
          if (typeof widgetOnModalClose === 'function') {
            widgetOnModalClose(event);
          }

          context.pathfora.closeWidget(widget.id, true);
        };
      } else if (config.type === 'message') {
        widgetOk.onclick = function () {
          if (typeof widgetOnButtonClick === 'function') {
            widgetOnButtonClick(event);
          }

          context.pathfora.closeWidget(widget.id);
        };
      } else if (config.type === 'form') {
        widgetOk.onclick = function () {
          if (typeof widgetOnModalClose === 'function') {
            widgetOnModalClose(event);
          }

          context.pathfora.closeWidget(widget.id);
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
        ' pf-widget-variant-' + config.variant,
        config.theme ? ' pf-theme-' + config.theme : ''
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
        choices = ['left', 'right'];
        break;
      case 'bar':
        choices = ['top-fixed', 'top-scrolling', 'bottom-scrolling'];
        break;
      case 'button':
        choices = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        break;
      case 'folding':
        choices = ['left', 'bottom-left', 'bottom-right'];
        break;
      }

      if (choices.indexOf(config.position) === -1) {
        // FIXME Console in production
        // console.warn(config.position + ' is not valid position for ' + config.layout);
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

    // FIXME Really inefficient and inaccurate, either cache initial time and subtract
    //       or calculate delta
    /**
     * @description Track time spent on page
     */
    trackTimeOnPage: function () {
      core.tickHandler = setInterval(function () {
        pathforaDataObject.timeSpentOnPage += 1;
      }, 1000);
    },

    // FUTURE
    /**
     * @description Determine whether the user visited the site before (set the cookie)
     * @returns {boolean}
     */
    checkIfUserJustEntered: function () {
      if (!utils.readCookie('PathforaInit')) {
        utils.saveCookie('PathforaInit', true, 30);
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
      var header = widget.querySelector('.pf-widget-header');
      var headerLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-header');
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

      if (header) {
        header.style.color = colors.header;
      }

      if (headerLeft) {
        headerLeft.style.color = colors.header;
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

      switch (action) {
      case 'show':
        pathforaDataObject.displayedWidgets.push(params);
        break;
      case 'close':
        pathforaDataObject.closedWidgets.push(params);
        break;
      case 'confirm':
        params['pf-widget-action'] = widget.confirmAction.name;
        pathforaDataObject.completedActions.push(params);
        break;
      case 'cancel':
        params['pf-widget-action'] = widget.cancelAction.name;
        pathforaDataObject.cancelledActions.push(params);
        break;
      case 'submit':
        params['pf-form-username'] = htmlElement.elements['username'].value;
        params['pf-form-title'] = htmlElement.elements['title'].value;
        params['pf-form-email'] = htmlElement.elements['email'].value;
        params['pf-form-message'] = htmlElement.elements['message'].value;
        break;
      case 'subscribe':
        params['pf-form-email'] = htmlElement.elements['email'].value;
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
     * @param {array} array list of widgets to initialize
     */
    initializeWidgetArray: function (array) {
      var widgetOnInitCallback;
      var defaults;
      var globals;
      var widget;
      var widgetABGroup;
      var i;
      var j;

      j = array.length;
      for (i = 0; i < j; i++) {
        widget = array[i];
        widgetOnInitCallback = widget.config.onInit;
        defaults = defaultProps[widget.type];
        globals = defaultProps.generic;
        widgetABGroup = Math.min(widget.config.testGroup || 0, pathforaDataObject.abTestingMode.groupsNumber - 1);

        if (pathforaDataObject.abTestingMode && widgetABGroup !== pathforaDataObject.abTestingGroup) {
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

    initializeABTestingOnWidget: function (widget) {
      var testGroup = widget.testGroup || 0;

      if (testGroup >= pathforaDataObject.abTestingMode.groupsNumber) {
        testGroup = 0;
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

        for (i = 0; i < j; i++) {
          if (!widgets.target[i].segment) {
            throw new Error('All targeted widgets should have segment specified');
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

      if (!config.msg) {
        throw new Error('Widget message is missing');
      }

      if(config.layout === 'random') {
        props = {
          layout: ['modal', 'slideout', 'bar', 'button', 'folding'],
          variant: ['1', '2'],
          slideout: ['left', 'right'],
          bar: ['top-fixed', 'top-scrolling', 'bottom-scrolling'],
          button: ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
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
        case 'button':
          config.position = props.button[Math.floor(Math.random() * 6)];
        }
      }
      widget.type = type;
      widget.config = config;
      widget.id = config.id || utils.generateUniqueId();

      return widget;
    }
  };

  /**
   * @namespace
   * @name api
   * @description Lytics API integration tools
   */
  api = {
    /**
     * @description Send user data to Lytics API
     */
    initializeCustomAPI: function () {
      var seerId = utils.readCookie('seerid');

      if (typeof jstag === 'object' && seerId) {
        jstag.send({
          'user_id': seerId
        });
      }
    },

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
     * @param {object} data payload
     */
    reportData: function (data) {
      if (typeof jstag === 'object') {
        jstag.send(data);
      } else {
        // FIXME Console in production
        // console.warn('Cannot find Lytics tag, reporting disabled');
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
        'https://api.lytics.io/api/me/',
        accountId,
        '/',
        seerId,
        '?segments=true'
      ].join('');

      this.getData(apiUrl, function (response) {
        callback(JSON.parse(response).data.segments);

      }, function () {
        // FIXME Console in production (if uncommented, add 'error' to args)
        // console.error(error);

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

      api.initializeCustomAPI();
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

        if (widgets.target) {
          api.checkUserSegments(lyticsId, function (segments) {
            var triggered = false;
            var target;
            var i;
            var j;

            j = widgets.target.length;
            for (i = 0; i < j; i++) {
              target = widgets.target[i];
              if (segments.indexOf(target.segment) !== -1) {
                core.initializeWidgetArray(target.widgets);
                triggered = true;
                break;
              }
            }
            if (!triggered && widgets.inverse) {
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
     * @public
     * @description Set an A/B testing mode for the global Pathfora object
     * @param {string} mode A/B testing mode
     */
    this.setABTestingMode = function (mode) {
      var abTestingMode = abTestingTypes[mode];
      var abTestingValue = utils.readCookie(abHashMD5);
      var abTestingGroup = 0;
      var i;

      if (abTestingMode) {
        pathforaDataObject.abTestingMode = abTestingMode;
      }

      if (!abTestingValue) {
        abTestingValue = Math.random();

        utils.saveCookie(abHashMD5, abTestingValue);
      }

      // NOTE Determine visible group for the user
      i = 0;
      while (i < 1) {
        i += abTestingMode.groups[abTestingGroup];

        if (abTestingValue <= i) {
          break;
        }

        abTestingGroup++;
      }

      pathforaDataObject.abTestingGroup = abTestingGroup;
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
     * @description Display a widget
     * @param {object} widget
     */
    this.showWidget = function (widget) {
      var i;
      var j;
      var node;

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
      document.body.appendChild(node);

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
        abTestingMode: null,
        abTestingGroup: null
      };

      if (originalConf) {
        defaultProps = originalConf;
      }
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
