/** @module core/cancel-delayed-widget */

import { widgetTracker } from '../../globals/config';

export default function cancelDelayedWidget (widget) {
  var delayObj = widgetTracker.delayedWidgets[widget.id];

  if (delayObj) {
    clearTimeout(delayObj);
    delete widgetTracker.delayedWidgets[widget.id];
  }
}
