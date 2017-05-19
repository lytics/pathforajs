/** @module core/cancel-delayed-widget */

import { widgetTracker } from '../../globals/config';

/**
 * Cancel waiting for a delayed widget
 *
 * @exports cancelDelayedWidget
 * @params {obj} widget
 */
export default function cancelDelayedWidget (widget) {
  var delayObj = widgetTracker.delayedWidgets[widget.id];

  if (delayObj) {
    clearTimeout(delayObj);
    delete widgetTracker.delayedWidgets[widget.id];
  }
}
