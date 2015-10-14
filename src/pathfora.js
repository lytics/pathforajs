// 'use strict';
// Pathfora API

(function (context, document) {

    /**
     * Appends pathfora stylesheet to document
     */
    var appendPathforaStylesheet = function () {
        var link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', '../dist/pathfora.min.css');
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    };

    /**
     * Regexp helper variables used by utility functions
     * @type {RegExp}
     */
    var rclass = /[\t\r\n\f]/g,
        rnotwhite = (/\S+/g),
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;


    /**
     * Helper utility functions
     * based on jQuery functions with some modifications
     */
    var utils = {

        /**
         * Checks is DOM node has provided class
         * @param {object} DOMnode - DOM element
         * @param {string} value - class name
         * @returns {boolean}
         */
        hasClass: function (DOMnode, value) {
            if (DOMnode.nodeType === 1 &&
                (" " + DOMnode.className + " ").replace(rclass, " ").indexOf(" " + value + " ") >= 0) {
                return true;
            }
            return false;
        },


        /**
         * Adds class to passed DOM node
         * @param {object} DOMnode - DOM element
         * @param {string} value - class name
         */
        addClass: function (DOMnode, value) {
            var classes, cur, clazz, j, finalValue;
            if (typeof value === "string" && value) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = (value || "").match(rnotwhite) || [];
                cur = DOMnode.nodeType === 1 &&
                (DOMnode.className ? (" " + DOMnode.className + " ").replace(rclass, " ") : " ");
                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        if (cur.indexOf(" " + clazz + " ") < 0) {
                            cur += clazz + " ";
                        }
                    }
                    finalValue = cur == null ? "" : (cur + "").replace(rtrim, "");
                    if (DOMnode.className !== finalValue) {
                        DOMnode.className = finalValue;
                    }
                }
            }
        },


        /**
         * Removes class from DOM elmeent
         * @param {object} DOMnode - DOM element
         * @param {string} value - class name
         */
        removeClass: function (DOMnode, value) {
            var classes, cur, clazz, j, finalValue;
            if ((typeof value === "string" && value) && (DOMnode && DOMnode.nodeType === 1)) {
                classes = (value || "").match(rnotwhite) || [];
                // This expression is here for better compressibility (see addClass)
                cur = (DOMnode.className ? (" " + DOMnode.className + " ").replace(rclass, " ") : "");
                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        // Remove *all* instances
                        while (cur.indexOf(" " + clazz + " ") >= 0) {
                            cur = cur.replace(" " + clazz + " ", " ");
                        }
                    }
                    finalValue = value ? (cur == null ? "" : (cur + "").replace(rtrim, "")) : "";
                    if (DOMnode.className !== finalValue) {
                        DOMnode.className = finalValue;
                    }
                }
            }
        },


        /**
         * Reads browser Cookie value of specified name
         * @param {string} name - cookie name
         */
        readCookie: function (name) {
            var nameEQ,
                ca,
                i,
                c;
            nameEQ = name + "=";
            ca = context.document.cookie.split(';');
            for (i = 0; i < ca.length; i = i + 1) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        },

        /**
         * Saves browser cookie
         * @param {string} name - cookie name
         * @param {string} value - cookie value
         * @param {number} days - number of days until cookie expires
         */
        saveCookie: function (name, value, days) {
            var expires,
                date;
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            context.document.cookie = name + "=" + value + expires + "; path=/";
        },

        /**
         * Generates unique
         * @param {string} name - cookie name
         * @param {string} value - cookie value
         * @param {number} days - number of days until cookie expires
         */
        generateUniqueId: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },
        randomChoice: function (items) {
            return items[Math.floor(Math.random() * items.length)];
        }
    };


    /**
     * Default configuration object
     * oryginalConf is used when default data gets overriden
     */
    var oryginalConf,
        defaultPositions = {
            modal: '',
            slideout: 'left',
            button: 'top-left',
            bar: 'top-fixed',
            folding: 'bottom-left'
        },
        defaultProps = {
        generic: {
            className: "pathfora",
            header: "",
            theme: 'default',
            themes: {
                default: {
                    background: '#ddd',
                    header: "#333",
                    text: "#333",
                    close: "#999",
                    actionText: "#333",
                    actionBackground: "#eee",
                    cancelText: "#333",
                    cancelBackground: "#eee"
                },
                dark: {
                    background: '#333',
                    header: "#fff",
                    text: "#fff",
                    close: "#888",
                    actionText: "#fff",
                    actionBackground: "#597E9B",
                    cancelText: "#fff",
                    cancelBackground: "#597E9B"
                },
                light: {
                    background: '#ddd',
                    header: "#333",
                    text: "#333",
                    close: "#999",
                    actionText: "#333",
                    actionBackground: "#eee",
                    cancelText: "#333",
                    cancelBackground: "#eee"
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
            layout: "modal",
            position: "",
            variant: "1",
            cancelButton: true,
            okMessage: 'Confirm',
            cancelMessage: 'Cancel',
            okShow: true,
            cancelShow: true
        },
        subscription: {
            layout: "modal",
            position: "",
            variant: "1",
            placeholders: {
                email: "Email"
            },
            okMessage: 'Confirm',
            cancelMessage: 'Cancel',
            okShow: true,
            cancelShow: true
        },
        form: {
            layout: "modal",
            position: "",
            variant: "1",
            nameField: true,
            titleField: false,
            placeholders: {
                name: "Name",
                title: "Title",
                email: "Email",
                message: "Message"
            },
            okMessage: 'Send',
            cancelMessage: 'Cancel',
            okShow: true,
            cancelShow: true
        }
    };

    /**
     * Empty Pathfora data object, containg all data stored by lib
     * @type {Object}
     */
    var pathforaDataObject = {
        pageViews: 0,
        timeSpentOnPage: 0,
        closedWidgets: [],
        completedActions: [],
        cancelledActions: [],
        displayedWidgets: []
    };

    /**
     * Core library function set
     */
    var core = {
        delayedWidgets: {},
        openedWidgets: [],
        initializedWidgets: [],
        watchers: [],


        /**
         * Displays single widget or registers handler for displaying it later
         * @param {object} widget - element to initialize
         */
        initializeWidget: function (widget) {
            var cond = widget.displayConditions;
            var watcher;

            if (cond.displayWhenElementVisible) {
                watcher = core.registerElementWatcher(cond.displayWhenElementVisible, widget);
                core.watchers.push(watcher);
                core.initializeScrollWatchers(core.watchers);
            } else if (cond.scrollPercentageToDisplay) {
                watcher = core.registerPositionWatcher(cond.scrollPercentageToDisplay, widget);
                core.watchers.push(watcher);
                core.initializeScrollWatchers(core.watchers);
            } else if (cond.showOnInit) {
                pathfora.showWidget(widget);
            }
        },


        /**
         * Takes array of scroll aware elements and checks if it should display one when user is scrolling page
         * @param {array} watchers - pointer to registered list of watchers
         */
        initializeScrollWatchers: function (watchers) {
            if (!core.scrollListener) {
                core.scrollListener = function () {
                    for (var key in watchers) {
                        if (watchers.hasOwnProperty(key) && watchers[key] !== null) {
                            watchers[key].check();
                        }
                    }
                };
                if (typeof context.addEventListener === 'function') {
                    context.addEventListener('scroll', core.scrollListener, false);
                } else {
                    context.onscroll = core.scrollListener;
                }
            }
        },


        /**
         * Taks array of watchers and clears it
         * @param {array} watchers - pointer to the list of watchers
         */
        removeScrollWatchers: function (watchers) {
            watchers.forEach(function (watcher) {
                core.removeWatcher(watcher);
            });

            context.removeEventListener('scroll', core.scrollListener, false);
            delete core.scrollListener;
        },


        /**
         * Waits amount of time specified in widget config before initializing it
         * @param {object} widget - element which should be initialized
         */
        registerDelayedWidget: function (widget) {
            this.delayedWidgets[widget.id] = setTimeout(function () {
                core.initializeWidget(widget);
            }, widget.displayConditions.showDelay * 1000);
        },


        /**
         * Prevents delayed widgets from initializing
         * @param {object} widget - element which should be cancelled
         */
        cancelDelayedWidget: function (widget) {
            var delayObj = this.delayedWidgets[widget.id];

            if (delayObj) {
                clearTimeout(delayObj);
                delete this.delayedWidgets[widget.id];
            }
        },


        /**
         * Registers watcher for checking if user is on particular scroll position.
         * @param {number} percent - scroll percentage on which widget should be displayed
         * @param {object} widget - widget which should be displayed
         * @returns {{check: Function}} - function fired on scroll for checking if widget should be displayed
         */
        registerPositionWatcher: function (percent, widget) {
            var watcher = {
                check: function () {
                    var positionInPixels = (document.body.offsetHeight - window.innerHeight) * percent / 100;
                    var offset = document.documentElement.scrollTop || document.body.scrollTop;
                    if (offset >= positionInPixels) {
                        pathfora.showWidget(widget);
                        core.removeWatcher(watcher);
                    }
                }
            };

            return watcher;
        },


        /**
         * Registers watcher for checking if user can see some element
         * @param {string} id - id of triggering element
         * @param {object} widget - widget which should be displayed
         * @returns {{elem: Element, check: Function}} - function fired on scroll to check if user can see specified el.
         */
        registerElementWatcher: function (id, widget) {
            var watcher = {
                elem: document.getElementById(id),
                check: function () {
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    var scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;
                    if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
                        pathfora.showWidget(widget);
                        core.removeWatcher(watcher);
                    }
                }
            };

            return watcher;
        },


        /**
         * Unassigns specified watcher
         * @param {string} watcher - name of watcher which should be removed
         */
        removeWatcher: function (watcher) {
            for (var key in core.watchers) {
                if (core.watchers.hasOwnProperty(key) && watcher == core.watchers[key]) {
                    core.watchers.splice(key, 1);
                }
            }
        },


        /**
         * Creates layout portion of widget's DOM object
         * @param {object} widget - related element
         * @param {object} config
         */
        constructWidgetLayout: function (widget, config) {
            if (widget.querySelector('.pf-widget-cancel') != null) {
                if(!config.cancelShow){
                    var node = widget.querySelectorAll('.pf-widget-cancel')[0];
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                }
            }

            if (widget.querySelector('.pf-widget-ok') != null) {
                if(!config.okShow){
                    var node = widget.querySelectorAll('.pf-widget-ok')[0];
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                }
            }


            if(widget.querySelector('.pf-widget-cancel') != null)
                widget.querySelector('.pf-widget-cancel').innerHTML = config.cancelMessage;

            if(widget.querySelector('.pf-widget-ok') != null)
                widget.querySelector('.pf-widget-ok').innerHTML = config.okMessage;

            if(widget.querySelector('.pf-widget-ok') && widget.querySelector('.pf-widget-ok').value != null)
                widget.querySelector('.pf-widget-ok').value = config.okMessage;

            if(widget.querySelector('.pf-widget-cancel') && widget.querySelector('.pf-widget-cancel').value != null)
                widget.querySelector('.pf-widget-cancel').value = config.cancelMessage;

            switch (config.type) {
                case 'form':
                    switch (config.layout) {
                        case 'folding':
                        case 'modal':
                        case 'slideout':
                        case 'random':
                            widget.querySelector('form').onsubmit = function (e) {
                                e.preventDefault();
                                core.trackWidgetAction('submit', config, e.target);
                                context.pathfora.closeWidget(widget.id, true);
                            };
                            widget.querySelectorAll('input')[0].placeholder = config.placeholders.name;
                            widget.querySelectorAll('input')[1].placeholder = config.placeholders.title;
                            widget.querySelectorAll('input')[2].placeholder = config.placeholders.email;
                            widget.querySelector('textarea').placeholder = config.placeholders.message;
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
                            widget.querySelector('form').onsubmit = function (e) {
                                e.preventDefault();
                                core.trackWidgetAction('subscribe', config, e.target);
                                context.pathfora.closeWidget(widget.id, true);
                            };

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

            // Set The header
            var header = widget.querySelectorAll('.pf-widget-header');
            for (var i = header.length - 1; i >= 0; i--) {
                header[i].innerHTML = config.header;
            }

            // Set the Image
            if (config.image) {
                if (config.layout === "button") {
                    console.warn('Images are not compatible with the button layout.');
                } else {
                    var image = document.createElement('img');
                    image.src = config.image;
                    image.className = 'pf-widget-img';
                    widget.querySelector('.pf-widget-body').appendChild(image);
                }
            } else {
                utils.addClass(widget, 'pf-no-img');
            }

            // Set the message
            widget.querySelector('.pf-widget-message').innerHTML = config.msg;
        },


        /**
         * Appends action logic to widget's DOM object
         * @param {object} widget - related element
         * @param {object} config
         */
        constructWidgetActions: function (widget, config) {
            switch (config.layout) {
                case 'folding':
                    var captions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left');

                    if (config.position !== 'left') {
                        setTimeout(function () {
                            var height = widget.offsetHeight - widget.querySelector('.pf-widget-caption').offsetHeight;
                            widget.style.bottom = -height + 'px';
                        }, 0);
                    }

                    for (var i = captions.length - 1; i >= 0; i--) {
                        captions[i].onclick = function () {
                            if (utils.hasClass(widget, 'opened')) {
                                utils.removeClass(widget, 'opened');
                            } else {
                                utils.addClass(widget, 'opened');
                            }
                        }
                    }
                    break;
                case 'button':
                    break;
                case 'modal':
                case 'slideout':
                case 'bar':
                    var cancelBtn = widget.querySelector('.pf-widget-cancel');
                    widget.querySelector('.pf-widget-close').onclick = function () {
                        context.pathfora.closeWidget(widget.id);
                    };

                    if (cancelBtn) {
                        if (typeof config.cancelAction === 'object') {
                            cancelBtn.onclick = function () {
                                core.trackWidgetAction('cancel', config);
                                if (typeof config.cancelAction.callback === 'function') {
                                    config.cancelAction.callback();
                                }
                                context.pathfora.closeWidget(widget.id, true);
                            };
                        } else {
                            cancelBtn.onclick = function () {
                                context.pathfora.closeWidget(widget.id);
                            };
                        }
                    }
                default:
                    break;
            }

            if (typeof config.confirmAction === 'object') {
                widget.querySelector('.pf-widget-ok').onclick = function () {
                    core.trackWidgetAction('confirm', config);
                    if (typeof config.confirmAction.callback === 'function') {
                        config.confirmAction.callback();
                    }
                    context.pathfora.closeWidget(widget.id, true);
                }
            } else if (config.type === 'message') {
                widget.querySelector('.pf-widget-ok').onclick = function () {
                    context.pathfora.closeWidget(widget.id);
                }
            }
        },


        /**
         * Builds's widget's color theme
         * @param {object} widget - related element
         * @param {object} config
         */
        setupWidgetColors: function (widget, config) {
            if (config.theme === undefined) {
                core.setCustomColors(widget, defaultProps.generic.themes['default']);
            }

            if(config.config && config.config.theme === null) {
                var colors = {};
                core.updateObject(colors, defaultProps.generic.themes['default']);
                core.updateObject(colors, config.config.colors);
                core.setCustomColors(widget, colors);
            } else if (config.themes) {
                var colors = {};
                // custom colors
                if (config.theme === "custom")
                    core.updateObject(colors, config.colors);
                // a default theme
                else
                    core.updateObject(colors, defaultProps.generic.themes[config.theme]);

                core.setCustomColors(widget, colors);
            }
        },


        /**
         * Constructs widget's DOM classes
         * @param {object} widget - related element
         * @param {object} config
         */
        setWidgetClassname: function (widget, config) {
            widget.className = 'pf-widget ' +
            'pf-' + config.type +
            ' pf-widget-' + config.layout +
            ( config.position ? ' pf-position-' + config.position : '' ) +
            ' pf-widget-variant-' + config.variant +
            ( config.theme ? ' pf-theme-' + config.theme : '' );
        },


        /**
         * Checks if user specified valid position for particullar widget type
         * @param {object} widget - related element
         * @param {object} config
         */
        validateWidgetPosition: function (widget, config) {
            var choices;
            var isValidPos = function (pos, choices) {
                return choices.indexOf(pos) > -1;
            };

            switch (config.layout) {
                case 'modal':
                    choices = ['', undefined];
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

            if (!isValidPos(config.position, choices)) {
                console.warn(config.position + " is not valid position for " + config.layout);
            }
        },


        /**
         * Sets default position for widget type, or validates position passed by user
         * @param {object} widget - related element
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
         * Constructs widget's DOM object
         * @param {object} config
         * @returns {Element} - prepared widget object
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


        /**
         * Tracks how much time user spend on page
         * Needed for future functionalities
         */
        trackTimeOnPage: function () {
            core.tickHandler = setInterval(function () {
                pathforaDataObject.timeSpentOnPage += 1;
            }, 1000)
        },


        /**
         * Checks if user is newcomer or was here before (based on stored cookie)
         * For future functionalities
         * @returns {boolean}
         */
        checkIfUserJustEntered: function () {
            var userEntered = utils.readCookie('PathforaInit');
            if (!userEntered) {
                utils.saveCookie('PathforaInit', true, 30);
                return true;
            }
            return false;
        },


        /**
         * Sets custom color theme to passed widget
         * @param {object} widget - related element
         * @param {object} colors - color configuration
         */
        setCustomColors: function (widget, colors) {
            var close = widget.querySelector('.pf-widget-close');
            var header = widget.querySelector('.pf-widget-header');
            var headerLeft = widget.querySelector('.pf-widget-caption-left .pf-widget-header');
            var cancelBtn = widget.querySelector('.pf-widget-cancel');
            var okBtn = widget.querySelector('.pf-widget-ok');
            var arrow = widget.querySelector('.pf-widget-caption span');
            var arrowLeft = widget.querySelector('.pf-widget-caption-left span');

            if (utils.hasClass(widget, 'pf-widget-modal')) {
                widget.querySelector('.pf-widget-content').style.backgroundColor = colors.background;
            } else {
                widget.style.backgroundColor = colors.background;
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
         * Reports data related to user action with widget (close, show, confirm, cancel, submit or subscribe)
         * @param {string} action - name of action
         * @param {object} widget - related widget object
         * @param {element} htmlElement - related DOM element (for getting Forms and Submition data values)
         */
        trackWidgetAction: function(action, widget, htmlElement) {
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
                    var form = htmlElement;

                    params['pf-form-username'] = form.elements['username'].value;
                    params['pf-form-title'] = form.elements['title'].value;
                    params['pf-form-email'] = form.elements['email'].value;
                    params['pf-form-message'] = form.elements['message'].value;
                    break;
                case 'subscribe':
                    form = htmlElement;
                    params['pf-form-email'] = form.elements['email'].value;
            }

            params['pf-widget-event'] = action;
            api.reportData(params);
        },


        /**
         * Updates object with new configuration values. Overrides provided values and leaves default one
         * when particullar value was not provided
         * @param {object} obj - oryginal element
         * @param {object} config - new configuration
         */
        updateObject: function (obj, config) {
            for (var prop in config) {
                if (typeof config[prop] !== null && typeof config[prop] === 'object') {
                    if(config.hasOwnProperty(prop)) {
                        if(obj[prop] === undefined) {
                            obj[prop] = {};
                        }
                        core.updateObject(obj[prop], config[prop]);
                    }
                } else {
                    if(config.hasOwnProperty(prop)) {
                        obj[prop] = config[prop];
                    }
                }
            }
        },


        /**
         * Updates widget elements, and initiallizes each one.
         * @param {array} arr - list of widgets which should be initialized
         */
        initializeWidgetArray: function (arr) {
            for (var i = 0; i < arr.length; i++) {
                var widget = arr[i];
                var defaults = defaultProps[widget.type];
                var globals = defaultProps.generic;

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
            }
        },


        /**
         * Checks if user provided valid widget configuration
         * @param {array} widgets - list of widgets to be checked
         */
        validateWidgetsObject: function (widgets) {
            if (!widgets) {
                throw new Error("Widgets not specified");
            }

            if (widgets.constructor !== Array && widgets.target) {
                for (var i = 0; i < widgets.target.length; i++) {
                    if (!widgets.target[i].segment) {
                        throw new Error("All targeted widgets should have segment specified");
                    }
                }
            }
        },


        /**
         * Checks if widget object is valid and appends default props to it
         * @param type
         * @param config
         * @returns {{}}
         */
        prepareWidget: function(type, config) {
            if (config === undefined) {
                throw new Error("Config object is missing");
            }

            if (config.msg === undefined) {
                throw new Error("Widget message is missing");
            }

            var widget = {};

            if(config.layout === "random")
            {
                var props = {
                    layout: ["modal","slideout","bar","button","folding"],
                    variant: ["1","2"],
                    slideout: ["left","right"],
                    bar: ["top-fixed","top-scrolling","bottom-scrolling"],
                    button: ["left","right","top-left","top-right","bottom-left","bottom-right"],
                    folding: ['left', 'bottom-left', 'bottom-right']
                }
                switch(type){
                    case 'message':
                        var r = Math.floor((Math.random() * 4));
                        config.layout = props.layout[r];
                        break;
                    case 'subscription':
                        var r = Math.floor((Math.random() * 5));
                        while(r == 3)
                           r = Math.floor((Math.random() * 5));
                        config.layout = props.layout[r];
                        break;
                    case 'form':
                        var r = Math.floor((Math.random() * 5));
                        while(r == 2 || r == 3)
                            r = Math.floor((Math.random() * 5));
                        config.layout = props.layout[r];
                }
                switch (config.layout) {
                            case 'folding':
                                config.position = props.folding[Math.floor((Math.random() * 3))];
                                config.variant = props.variant[Math.floor((Math.random() * 2))];
                                break;
                            case 'slideout':
                                config.position = props.slideout[Math.floor((Math.random() * 2))];
                                config.variant = props.variant[Math.floor((Math.random() * 2))];
                                break;
                            case 'modal':
                                config.variant = props.variant[Math.floor((Math.random() * 2))];
                                config.position = '';
                                break;
                            case 'bar':
                                config.position = props.bar[Math.floor((Math.random() * 3))];
                                break;
                            case 'button':
                                 config.position = props.button[Math.floor((Math.random() * 6))];
                }
            }
            widget.type = type;
            widget.config = config;
            widget.id = config.id || utils.generateUniqueId();

            return widget;
        }
    };


    /**
     * Set of functions for communicating data with external sources
     * @type {object}
     */
    var api = {
        /**
         * Sends data about user to Lytics API (from cookie), using jstag functrion
         */
        initializeCustomAPI: function () {
            var reed = utils.readCookie("seerid");

            if (typeof jstag === 'object' && reed) {
                jstag.send({user_id: reed});
            }
        },


        /**
         * XHR GET request builder
         * @param {string} url
         * @param {Function} onSuccess
         * @param {Function} onError
         */
        getData: function (url, onSuccess, onError) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    onSuccess(xhr.responseText);
                } else if (xhr.readyState == 4) {
                    onError(xhr.responseText);
                }
            };

            xhr.open("GET", url);
            xhr.send();
        },


        /**
         * XHR POST request builder
         * @param {string} url
         * @param {string} data
         * @param {Function} onSuccess
         * @param {Function} onError
         */
        postData: function (url, data, onSuccess, onError) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Accept","application/json");
            xhr.setRequestHeader('Content-type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    onSuccess(xhr.responseText);
                } else if (xhr.readyState == 4) {
                    onError(xhr.responseText);
                }
            };

            xhr.send(data);
        },


        /**
         * Sends data to Lytics API using jstag function
         * User credentials are took from cookie
         * @param {object} data
         */
        reportData: function (data) {
            if (typeof jstag === 'object') {
                jstag.send(data);
            } else {
                if (typeof console === 'function') {
                    console.warn('Cannot find Lytics tag, reporting disabled');
                }
            }
        },


        /**
         * Get's data on which Lytics segment current user is assigned to
         * @param {number} accountId - Lytics ID of website owner
         * @param cb - callback function
         */
        checkUserSegments: function (accountId, cb) {
            var reed = utils.readCookie("seerid");
            if (!reed) {
                throw new Error("Cannot find SEERID cookie");
            }
            var apiUrl = "https://api.lytics.io/api/me/" + accountId + "/"
                + reed + "?segments=true";

            this.getData(apiUrl, function(resp){
                var data = JSON.parse(resp);
                cb(data.data.segments);

            }, function (err) {
                console.error(err);

                cb({
                    data: {
                        segments: ["all"]
                    }
                });
            });
        }
    };


    /**
     * Object containing all html templates used for constructing widgets
     * @type {Object}
     */
    var templates = {
        message: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-cancel">Cancel</a><a class="pf-widget-btn pf-widget-ok">Confirm</a></div>',
            bar: '<a class="pf-widget-body"></a><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a><a class="pf-widget-btn pf-widget-cancel">Cancel</a></div>',
            button: '<p class="pf-widget-message pf-widget-ok"></p>',
            inline: ''
        },
        subscription: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div>',
            folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div>',
            bar: '<div class="pf-widget-body"></div><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><input type="submit" class="pf-widget-btn pf-widget-ok" /></form></div>'
        },
        form: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea name="message" rows="5" required></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button><button class="pf-widget-btn pf-widget-cancel">Cancel</button> </form></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><input name="username" type="text"><input name="title" type="text" required><input name="email" type="email" required><textarea name="message" rows="5" required></textarea> <button class="pf-widget-btn pf-widget-cancel">Cancel</button><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button></form></div>',
            folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea  name="message" rows="5" required></textarea> <button class="pf-widget-btn pf-widget-cancel">Cancel</button><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button> </form></div>'
        }
    };



    /**
     * Pathfora public functions
     * @constructor
     */
    var Pathfora = function () {


        /**
         * Function used for initializing Pathfora widgets array.
         * @param {array} widgets
         * @param {number} lyticsId
         * @param {object} config
         */
        this.initializeWidgets = function (widgets, lyticsId, config) {
            // IE < 10 not supported
            if (document.all && !context.atob) {
                return;
            }

            api.initializeCustomAPI();
            core.validateWidgetsObject(widgets);
            core.trackTimeOnPage();

            if (config) {
                oryginalConf = (JSON.parse(JSON.stringify(defaultProps)));
                core.updateObject(defaultProps, config);
            }

            // Simple initialization
            if (widgets.constructor === Array) {
                core.initializeWidgetArray(widgets);

                // Target sensitive widgets
            } else {
                if (widgets.common) {
                    core.initializeWidgetArray(widgets.common);
                    core.updateObject(defaultProps, widgets.common.config);
                }

                if (widgets.target) {
                    api.checkUserSegments(lyticsId, function (segments) {
                        var triggered = false;
                        for (var i = 0; i < widgets.target.length; i++) {
                            var target = widgets.target[i];
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
         * Creates minimal widget for previewing.
         * Used only by admin panel for generating mocked previews
         * @param {object} widget
         * @returns {*|Element}
         */
        this.previewWidget = function(widget) {
            widget.id = utils.generateUniqueId();
            return core.createWidgetHtml(widget);
        };


        /**
         * Getter used to prepare Message widget for initialization
         * @param {object} config
         * @returns {*|{}}
         * @constructor
         */
        this.Message = function (config) {
            return core.prepareWidget('message', config);
        };


        /**
         * Getter used to prepare Subscription widget for initialization
         * @param {object} config
         * @returns {*|{}}
         * @constructor
         */
        this.Subscription = function (config) {
            return core.prepareWidget('subscription', config);
        };


        /**
         * Getter used to prepare Form widget for initialization
         * @param {object} config
         * @returns {*|{}}
         * @constructor
         */
        this.Form = function (config) {
            return core.prepareWidget('form', config);
        };


        /**
         * Function used for displaying widget, either manually or triggered by PF core
         * @param {object} widget - related element
         */
        this.showWidget = function (widget) {

            for (var i = 0; i < core.openedWidgets.length; i++) {
                if (core.openedWidgets[i] === widget) {
                    return;
                }
            }

            core.openedWidgets.push(widget);
            core.trackWidgetAction('show', widget);

            var node = core.createWidgetHtml(widget);
            document.body.appendChild(node);

            // waits for appending to DOM for so it can trigger animation
            setTimeout(function () {
                utils.addClass(node, 'opened')
            }, 50);

            if (widget.displayConditions.hideAfter) {
                setTimeout(function () {
                    pathfora.closeWidget(widget.id);
                }, widget.displayConditions.hideAfter * 1000);
            }
        };


        /**
         *
         * @param {string} id
         * @param {Boolean} noTrack
         */
        this.closeWidget = function (id, noTrack) {
            for (var i = 0; i < core.openedWidgets.length; i++) {
                if (core.openedWidgets[i].id === id) {
                    if (!noTrack) {
                        core.trackWidgetAction('close', core.openedWidgets[i]);
                    }
                    core.openedWidgets.splice(i, 1);
                    break;
                }
            }

            var node = document.getElementById(id);
            utils.removeClass(node, 'opened');

            setTimeout(function () {
                if (node && node.parentNode){
                    node.parentNode.removeChild(node);
                }
            }, 500);
        };


        /**
         * Getter for stored data object, used mainly for Unit test purposes
         * @returns {object}
         */
        this.getData = function () {
            return pathforaDataObject;
        };


        /**
         * Closes all widgets and clears all library data and functions
         */
        this.clearAll = function () {
            var opened = core.openedWidgets;

            opened.forEach(function(widget) {
                element = document.getElementById(widget.id);
                utils.removeClass(element, 'opened');
                element.parentNode.removeChild(element);
            });

            opened.slice(0);

            var delayed = core.delayedWidgets;

            for (var i = delayed.length; i > -1; i--) {
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
                displayedWidgets: []
            };

            if (oryginalConf) {
                defaultProps = oryginalConf;
            }
        };


        /**
         * Getter for utility functions
         * @type {object}
         */
        this.utils = utils;
    };

    appendPathforaStylesheet();
    context.pathfora = new Pathfora();

    // webadmin generated config
    if (typeof pfCfg === 'object') {
        api.getData('https:' == document.location.protocol ? 'https' : 'http' +
            '://pathfora.parseapp.com/config/'+ pfCfg.uid + '/' + pfCfg.pid, function(data) {
            var parsed = JSON.parse(data);
            var widgets = parsed.widgets;
            var themes = {};
            if (typeof parsed.config.themes !== 'undefined') {
                for (i = 0; i < parsed.config.themes.length; i++) {
                    themes[parsed.config.themes[i].name] = parsed.config.themes[i].colors;
                }
            }
            var wgCfg = {generic:{themes:themes}};

            console.log(parsed);
            var prepareWidgetArray = function (arr) {
                for (var i=0; i < arr.length; i++) {
                    arr[i] = core.prepareWidget(arr[i].type, arr[i]);
                }
            };

            prepareWidgetArray(widgets.common);

            for (var i=0; i < widgets.target.length; i++) {
                prepareWidgetArray(widgets.target[i].widgets);
            }

            pathfora.initializeWidgets(widgets, pfCfg.lid, wgCfg);
        });
    };

})(window, document);
