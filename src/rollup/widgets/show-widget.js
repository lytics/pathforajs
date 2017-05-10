/** @module pathfora/widgets/show-widget */

import trackWidgetAction from '../data/tracking/track-widget-action'
import incrementImpressions from '../display-conditions/impressions/increment-impressions'
import createWidgetHtml from './create-widget-html'
import addClass from '../utils/class/add-class'
import closeWidget from './close-widget'
import widgetResizeListener from './widget-resize-listener'
import window from '../dom/window'
import { callbackTypes, widgetTracker } from '../globals/config'


export default function showWidget (widget) {
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

  if (widget.showSocialLogin) {
    if (widget.showForm === false) {
      widgetTracker.openedWidgets.pop();
      throw new Error('Social login requires a form on the widget');
    }
  }

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