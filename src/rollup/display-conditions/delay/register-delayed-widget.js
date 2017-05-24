/** @module pathfora/display-conditions/delay/register-delayed-widget */

import { widgetTracker } from '../../globals/config';

/**
 * Begin waiting for a delayed widget
 *
 * @exports registerDelayedWidget
 * @params {object} widget
 */
export default function registerDelayedWidget (widget) {
  var pf = this;
  widgetTracker.delayedWidgets[widget.id] = setTimeout(function () {
    pf.initializeWidget(widget);
  }, widget.displayConditions.showDelay * 1000);
}
