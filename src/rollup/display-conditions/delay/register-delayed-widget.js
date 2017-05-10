/** @module core/register-delayed-widget */

import { widgetTracker } from '../../globals/config'

export default function registerDelayedWidget (widget) {
  widgetTracker.delayedWidgets[widget.id] = setTimeout(function () {
     this.initializeWidget(widget);
  }, widget.displayConditions.showDelay * 1000);
};
