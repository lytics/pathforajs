/** @module pathfora/display-conditions/cancel-delayed-widget */

import { widgetTracker } from '../globals/config';

/**
 * Cancel waiting for a delayed widget
 *
 * @exports cancelDelayedWidget
 * @params {string} widgetKey id of the widget
 */
export default function cancelDelayedWidget (widgetKey) {
  var delayObj = widgetTracker.delayedWidgets[widgetKey];

  if (delayObj) {
    clearTimeout(delayObj);
    delete widgetTracker.delayedWidgets[widgetKey];
  }
}
