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

    if (widget.displayConditions.impressions) {
      incrementImpressions(widget);
    }

    var node = createWidgetHtml(widget);

    if (widget.pushDown) {
      addClass(document.querySelector('.pf-push-down'), 'opened');
    }

    if (widget.config.layout !== 'inline') {
      document.body.appendChild(node);
    } else {
      var hostNode = document.querySelector(widget.config.position);

      if (hostNode) {
        hostNode.appendChild(node);
      } else {
        widgetTracker.openedWidgets.pop();
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
          config: widget,
          widget: node
        });
      }
      if (widget.config.layout === 'modal' && typeof widget.config.onModalOpen === 'function') {
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

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('resize', function () {
        widgetResizeListener(widget, node);
      });
    }
  };

  // account for showDelay condition
  if (w.displayConditions && w.displayConditions.showDelay) {
    widgetTracker.delayedWidgets[w.id] = setTimeout(function () {
      openWidget(w);
    }, w.displayConditions.showDelay * 1000);
  } else {
    openWidget(w);
  }
}
