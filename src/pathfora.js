// 'use strict';
// Pathfora API

(function (context, document) {

    var link = document.createElement('link');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', '../dist/css/pathfora.css');
    document.head.appendChild(link);

    // helper functions
    // based on jQuery function with modifications
    var rclass = /[\t\r\n\f]/g,
        rnotwhite = (/\S+/g),
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    var utils = {
        hasClass: function (DOMnode, value) {
            if (DOMnode.nodeType === 1 &&
                (" " + DOMnode.className + " ").replace(rclass, " ").indexOf(" " + value + " ") >= 0) {
                return true;
            }
        },
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
        removeClass: function (DOMnode, value) {
            var classes, cur, clazz, j, finalValue;
            if ((typeof value === "string" && value) && (DOMnode.nodeType === 1)) {
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
        getWindowHeight: function () {
            return context.innerHeight;
        },
        getScrollTopPosition: function () {
            var doc = context.document.documentElement;
            return (context.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        },
        getElementPosition: function (DOMnode) {
            var bodyRect = context.document.body.getBoundingClientRect(),
                elemRect = DOMnode.getBoundingClientRect();
            return elemRect.top - bodyRect.top;
        },
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

    var oryginalConf, defaultProps = {
        generic: {
            className: "pathfora",
            header: "",
            theme: 'default',
            themes: {
                "default": {
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
                    background: '#ddd',
                    header: "#333",
                    text: "#333",
                    close: "#999",
                    actionText: "#333",
                    actionBackground: "#eee",
                    cancelText: "#333",
                    cancelBackground: "#eee"
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
            cancelButton: true
        },
        subscription: {
            layout: "modal",
            position: "",
            variant: "1",
            placeholder: "Email"
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
            }
        }
    };

    // private functions
    var core = {
        // Array of timed widgets, DOM position watchers
        // Should be able to handle both displaying and hiding widgets
        delayedWidgets: {},
        openedWidgets: [],
        initializedWidgets: [],
        watchers: [],

        initializeWidget: function (widget) {
            var cond = widget.displayConditions;
            var watcher;

            if (cond.displayWhenElementVisible) {
                watcher = core.registerElementWatcher(cond.displayWhenElementVisible, widget);
                core.watchers.push(watcher);
                core.initializeScrollWatchers();
            } else if (cond.scrollPercentageToDisplay) {
                watcher = core.registerPositionWatcher(cond.scrollPercentageToDisplay, widget);
                core.watchers.push(watcher);
                core.initializeScrollWatchers();
            } else if (cond.showOnInit) {
                pathfora.showWidget(widget);
            }
        },

        initializeScrollWatchers: function () {
            if (!core.scrollListener) {
                core.scrollListener = function () {
                    for (var key in core.watchers) {
                        if (core.watchers[key] !== null) {
                            core.watchers[key].check();
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

        removeScrollWatchers: function () {
            core.watchers.forEach(function (watcher) {
                core.removeWatcher(watcher);
            });

            context.removeEventListener('scroll', core.scrollListener, false);
            delete core[scrollListener];
        },

        registerDelayedWidget: function (widget) {
            this.delayedWidgets[widget.id] = setTimeout(function () {
                core.initializeWidget(widget);
            }, widget.displayConditions.showDelay * 1000);
        },

        cancelDelayedWidget: function (widget) {
            var delayObj = this.delayedWidgets[widget.id];

            if (delayObj) {
                clearTimeout(delayObj);
                delete this.delayedWidgets[widget.id];
            }
        },

        registerPositionWatcher: function (percent, widget) {
            var watcher = {
                check: function () {
                    var positionInPixels = document.body.offsetHeight * percent / 100;
                    if (document.body.scrollTop >= positionInPixels) {
                        pathfora.showWidget(widget);
                        core.removeWatcher(watcher);
                    }
                }
            };

            return watcher;
        },

        registerElementWatcher: function (id, widget) {
            var watcher = {
                elem: document.getElementById(id),
                check: function () {
                    if (watcher.elem.offsetTop - window.innerHeight / 2 <= document.body.scrollTop) {
                        pathfora.showWidget(widget);
                        core.removeWatcher(watcher);
                    }
                }
            };

            return watcher;
        },

        removeWatcher: function (watcher) {
            for (var key in core.watchers) {
                if (watcher == core.watchers[key]) {
                    core.watchers.splice(key, 1);
                }
            }
        },

        createWidgetHtml: function (config) {
            var widget = document.createElement('div');

            widget.className = 'pf-widget ' +
            'pf-' + config.type +
            ' pf-widget-' + config.layout +
            ( config.position ? ' pf-position-' + config.position : '' ) +
            ' pf-widget-variant-' + config.variant +
            ( config.theme ? ' pf-theme-' + config.theme : '' );

            widget.innerHTML = templates[config.type][config.layout] || '';
            widget.id = config.id;

            switch (config.type) {
                case 'form':
                    switch (config.layout) {
                        case 'folding':
                        case 'modal':
                        case 'slideout':
                            widget.querySelector('form').onsubmit = function (e) {
                                e.preventDefault();
                                core.trackFormSubmit(config, e.target);
                                context.pathfora.closeWidget(widget.id, true);
                            };
                            widget.querySelectorAll('input')[0].placeholder = config.placeholders.name;
                            widget.querySelectorAll('input')[1].placeholder = config.placeholders.title;
                            widget.querySelectorAll('input')[2].placeholder = config.placeholders.email;
                            widget.querySelector('textarea').placeholder = config.placeholders.message;
                    }
                case 'subscription':
                    switch (config.layout) {
                        case 'folding':
                        case 'modal':
                        case 'bar':
                        case 'slideout':
                            widget.querySelector('form').onsubmit = function (e) {
                                e.preventDefault();
                                core.trackSubsctiption(config, e.target);
                                context.pathfora.closeWidget(widget.id, true);
                            };

                            if(config.type === 'subscription') {
                                widget.querySelector('input').placeholder = config.placeholder;
                            }
                    }
                case 'message':
                default:
                    switch (config.layout) {
                        case 'modal':
                        case 'folding':
                        case 'slideout':
                            var header = widget.querySelectorAll('.pf-widget-header');
                            for (var i = header.length - 1; i >= 0; i--) {
                                header[i].innerHTML = config.header;
                            }
                        case 'bar':
                            if (config.image) {
                                var image = document.createElement('img');
                                image.src = config.image;
                                image.className = 'pf-widget-img';
                                widget.querySelector('.pf-widget-body').appendChild(image);
                            } else {
                                utils.addClass(widget, 'pf-no-img');
                            }
                        case 'button':
                            widget.querySelector('.pf-widget-message').innerHTML = config.msg;
                        default:
                            break;
                    }
                    break;
            }

            switch (config.layout) {
                case 'folding':
                    var captions = widget.querySelectorAll('.pf-widget-caption, .pf-widget-caption-left');

                    if (config.position !== 'left') {
                        setTimeout(function () {
                            widget.style.bottom = -widget.offsetHeight + 'px';
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
                                core.trackCancelling(config);
                                config.cancelAction.callback();
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
                    core.trackConfirmation(config);
                    config.confirmAction.callback();
                    context.pathfora.closeWidget(widget.id, true);
                }
            } else if (config.type === 'message') {
                widget.querySelector('.pf-widget-ok').onclick = function () {
                    context.pathfora.closeWidget(widget.id);
                }
            }

            if (config.theme === undefined) {
                core.setCustomColors(widget, defaultProps.generic.themes['default']);
            }

            if (config.colors) {
                var colors = {};
                core.updateObject(colors, defaultProps.generic.colors);
                core.updateObject(colors, config.colors);
                core.setCustomColors(widget, colors);
            }

            return widget;
        },
        trackTimeOnPage: function () {
            core.tickHandler = setInterval(function () {
                pathforaDataObject.timeSpentOnPage += 1;
            }, 1000)
        },
        checkIfUserJustEntered: function () {
            var userEntered = utils.readCookie('PathforaInit');
            if (!userEntered) {
                saveCookie('PathforaInit', true, 30);
                return true;
            }
            return false;
        },

        // should be able to either pick target variant, or randomly select one
        setWidgetVariation: function () {
        },
        setCustomColors: function (widget, colors) {
            var close = widget.querySelector('.pf-widget-close');
            var header = widget.querySelector('.pf-widget-header');
            var cancelBtn = widget.querySelector('.pf-widget-cancel');
            var okBtn = widget.querySelector('.pf-widget-ok');

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
            core.saveDataObject();
        },
        trackConfirmation: function(widget) {
            this.trackWidgetAction('confirm', widget);
        },
        trackCancelling: function(widget) {
            this.trackWidgetAction('cancel', widget);
        },
        trackDisplayingWidget: function (widget) {
            this.trackWidgetAction('show', widget);
        },
        trackClosingWidget: function (widget) {
            this.trackWidgetAction('close', widget);
        },
        trackFormSubmit: function (widget, form) {
            this.trackWidgetAction('submit', widget, form);
        },
        trackSubsctiption: function(widget, form) {
            this.trackWidgetAction('subscribe', widget, form);
        },
        saveDataObject: function () {

        },
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
        validateWidgetsObject: function (widgets) {
            if (!widgets) {
                throw "Widgets not specified";
            }

            if (widgets.constructor !== Array && widgets.target) {
                for (var i = 0; i < widgets.target.length; i++) {
                    if (!widgets.target[i].segment) {
                        throw "All targeted widgets should have segment specified"
                    }
                }
            }
        },
        prepareWidget: function(type, config) {
            if (config === undefined) {
                throw "Config object is missing";
            }

            if (config.msg === undefined) {
                throw "Widget message is missing";
            }

            var widget = {};

            widget.type = type;
            widget.config = config;
            widget.id = config.id || utils.generateUniqueId();

            return widget;
        }
    };

    var pathforaDataObject = {
        pageViews: 0,
        timeSpentOnPage: 0,
        closedWidgets: [],
        completedActions: [],
        cancelledActions: [],
        displayedWidgets: []
    };

    var api = {
        initializeCustomAPI: function () {
            var reed = utils.readCookie("seerid");

            if (typeof jstag === 'object' && reed) {
                jstag.send({user_id: reed});
            }
        },
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

            xhr.send('test');
        },
        reportData: function (data) {
            if (typeof jstag === 'object') {
                jstag.send(data);
            } else {
                if (typeof console === 'function') {
                    console.warn('Cannot find Lytics tag, reporting disabled');
                }
            }
        },

        checkUserSegments: function (accountId, cb) {
            var reed = utils.readCookie("seerid");
            if (!reed) {
                throw "Cannot find SEERID cookie";
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

    var templates = {
        message: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-cancel">Cancel</a><a class="pf-widget-btn pf-widget-ok">Confirm</a></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a></div>',
            bar: '<a class="pf-widget-body"></a><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><a class="pf-widget-btn pf-widget-ok">Confirm</a></div>',
            button: '<p class="pf-widget-message pf-widget-ok"></p>',
            inline: ''
        },
        subscription: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div>',
            folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><button type="submit" class="pf-widget-btn pf-widget-ok">X</button></form></div>',
            bar: '<a class="pf-widget-body"></a><a class="pf-widget-close">&times;</a><div class="pf-bar-content"><p class="pf-widget-message"></p><form><input name="email" type="email" required><input type="submit" class="pf-widget-btn pf-widget-ok" /></form></div>'
        },
        form: {
            modal: '<div class="pf-widget-container"><div class="pf-va-middle"><div class="pf-widget-content"><a class="pf-widget-close">&times;</a><h2 class="pf-widget-header"></h2><div class="pf-widget-body"><div class="pf-va-middle"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea name="message" rows="5" required></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button></form></div></div></div></div></div>',
            slideout: '<a class="pf-widget-close">&times;</a><div class="pf-widget-body"></div><div class="pf-widget-content"><h2 class="pf-widget-header"></h2><p class="pf-widget-message"></p><form><input name="username" type="text"><input name="title" type="text" required><input name="email" type="email" required><textarea name="message" rows="5" required></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button></form></div>',
            folding: '<a class="pf-widget-caption"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><a class="pf-widget-caption-left"><p class="pf-widget-header"></p><span>&rsaquo;</span></a><div class="pf-widget-body"></div><div class="pf-widget-content"><p class="pf-widget-message"></p><form><input name="username" type="text" required><input name="title" type="text"><input name="email" type="email" required><textarea  name="message" rows="5" required></textarea><button type="submit" class="pf-widget-btn pf-widget-ok">Send</button></form></div>'
        }
    };

    // public functions
    var Pathfora = function () {
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
                        for (var i = 0; i < widgets.target.length; i++) {
                            var target = widgets.target[i];
                            if (segments.indexOf(target.segment) !== -1) {
                                core.initializeWidgetArray(target.widgets);
                                break;
                            }
                        }
                    });
                }
            }
        };

        this.previewWidget = function(widget) {
            widget.id = utils.generateUniqueId();
            return core.createWidgetHtml(widget);
        };

        this.Message = function (config) {
            return core.prepareWidget('message', config);
        };

        this.Subscription = function (config) {
            return core.prepareWidget('subscription', config);
        };

        this.Form = function (config) {
            return core.prepareWidget('form', config);
        };

        this.showWidget = function (widget) {
            for (var i = 0; i < core.openedWidgets.length; i++) {
                if (core.openedWidgets[i] === widget) {
                    return;
                }
            }

            core.openedWidgets.push(widget);
            core.trackDisplayingWidget(widget);

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

        this.closeWidget = function (id, noTrack) {
            for (var i = 0; i < core.openedWidgets.length; i++) {
                if (core.openedWidgets[i].id === id) {
                    if (!noTrack) {
                        core.trackClosingWidget(core.openedWidgets[i]);
                    }
                    core.openedWidgets.splice(i, 1);
                    break;
                }
            }

            var node = document.getElementById(id);
            utils.removeClass(node, 'opened');

            setTimeout(function () {
                if (node.parentNode){
                    node.parentNode.removeChild(node);
                }
            }, 500);

        };

        this.getData = function () {
            return pathforaDataObject;
        };
        this.clearAll = function () {
            var opened = core.openedWidgets;

            opened.forEach(function(widget) {
                element = document.getElementById(widget.id);
                utils.removeClass(element, 'opened');
                element.parentNode.removeChild(element);
            });

            opened.slice(0);

            core.openedWidgets = [];
            core.initializedWidgets = [];

            pathforaDataObject = {
                pageViews: 0,
                timeSpentOnPage: 0,
                closedWidgets: [],
                completedActions: [],
                displayedWidgets: []
            };

            if (oryginalConf) {
                defaultProps = oryginalConf;
            }
        };

        this.api = api;
        this.utils = utils;
    };

    context.pathfora = new Pathfora();

})(window, document);