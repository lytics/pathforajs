/** @module pathfora/widgets/show-widget */

import trackWidgetAction from '../../core/tracking/track-widget-action'
import incrementImpressions from '../../core/displayConditions/impressions/increment-impressions'
import createWidgetHtml from '../../core/widgets/create-widget-html'
import addClass from '../../utils/class/add-class'
import widgetResizeListener from '../../core/widgets/widget-resize-listener'


export default function showWidget () {
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
};