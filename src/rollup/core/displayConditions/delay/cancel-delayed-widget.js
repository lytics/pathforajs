/** @module core/cancel-delayed-widget */

export default function cancelDelayedWidget (widget) {
  var delayObj = this.delayedWidgets[widget.id];

  if (delayObj) {
    clearTimeout(delayObj);
    delete this.delayedWidgets[widget.id];
  }
};