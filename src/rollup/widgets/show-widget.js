/** @module pathfora/widgets/show-widget */

// globals
import { callbackTypes, widgetTracker } from '../globals/config';

// dom
import window from '../dom/window';
import document from '../dom/document';

// utils
import addClass from '../utils/class/add-class';

// data
import trackWidgetAction from '../data/tracking/track-widget-action';

// display conditions
import incrementImpressions from '../display-conditions/impressions/increment-impressions';

// widgets
import createWidgetHtml from './create-widget-html';
import closeWidget from './close-widget';
import widgetResizeListener from './widget-resize-listener';

/**
 * Make the widget visible to the user
 *
 * @exports showWidget
 * @params {object} widget
 */

export default function showWidget (w) {
  var openWidget = function (widget) {
    // FIXME Change to Array#filter and Array#length
    for (var i = 0; i < widgetTracker.openedWidgets.length; i++) {
      if (widgetTracker.openedWidgets[i] === widget) {
        return;
      }
    }

    widgetTracker.openedWidgets.push(widget);
    trackWidgetAction('show', widget);

    // increment impressions for widget regardless of display condition need(s)
    incrementImpressions(widget);

    var node;

    try {
      node = createWidgetHtml(widget);
    } catch (error) {
      widgetTracker.openedWidgets.pop();
      throw new Error(error);
    }

    if (widget.pushDown) {
      addClass(document.querySelector('.pf-push-down'), 'opened');
    }

    if (
      widget.config.positionSelector == null &&
      widget.config.layout !== 'inline'
    ) {
      document.body.appendChild(node);

      if (widget.layout === 'modal' || widget.type === 'sitegate') {
        // ensure that we set focus the the modal for accessibility reasons
        var focusable = node.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length) {
          widget.listeners.tabindex = {
            type: 'keydown',
            target: document,
            fn: function (ev) {
              // for modal and sitegate widgets we need to limit tab cycle focus to the widget
              if (ev.keyCode === 9) {
                if (!node.contains(event.target)) {
                  ev.preventDefault();
                  focusable[0].focus();
                } else if (ev.target === focusable[focusable.length - 1]) {
                  ev.preventDefault();
                  focusable[0].focus();
                }
              }
            }
          };
        }
      }
    } else {
      // support legacy inline layout used position as selector.
      var selector = widget.config.positionSelector == null
        ? widget.config.position : widget.config.positionSelector;
      var hostNode = document.querySelector(selector);

      if (hostNode) {
        hostNode.appendChild(node);
      } else {
        widgetTracker.openedWidgets.pop();
        throw new Error('Widget could not be initialized in ' + selector);
      }
    }

    // NOTE wait for appending to DOM to trigger the animation
    // FIXME 50 - magical number
    setTimeout(function () {
      var widgetLoadCallback = widget.config.onLoad;

      addClass(node, 'opened');

      if (typeof widgetLoadCallback === 'function') {
        widgetLoadCallback(callbackTypes.LOAD, {
          config: widget,
          widget: node
        });
      }
      if (
        widget.config.layout === 'modal' &&
        typeof widget.config.onModalOpen === 'function'
      ) {
        widget.config.onModalOpen(callbackTypes.MODAL_OPEN, {
          config: widget,
          widget: node
        });
      }
    }, 50);

    if (widget.displayConditions.hideAfter) {
      setTimeout(function () {
        closeWidget(widget.id, true);
      }, widget.displayConditions.hideAfter * 1000);
    }

    widgetResizeListener(widget, node);

    widget.listeners.resize = {
      type: 'resize',
      target: window,
      fn: function () {
        widgetResizeListener(widget, node);
      }
    };

    for (var key in widget.listeners) {
      if (widget.listeners.hasOwnProperty(key)) {
        var val = widget.listeners[key];
        if (val.target && typeof val.target.addEventListener === 'function') {
          val.target.addEventListener(val.type, val.fn);
        }
      }
    }
  };

  var widgetOnInitCallback = w.onInit;
  if (typeof widgetOnInitCallback === 'function') {
    widgetOnInitCallback(callbackTypes.INIT, {
      config: w
    });
  }

  // account for showDelay condition
  if (w.displayConditions && w.displayConditions.showDelay) {
    widgetTracker.delayedWidgets[w.id] = setTimeout(function () {
      openWidget(w);
      document.querySelector('.pf-widget-ok').focus();
    }, w.displayConditions.showDelay * 1000);
  } else {
    openWidget(w);
  }
}
