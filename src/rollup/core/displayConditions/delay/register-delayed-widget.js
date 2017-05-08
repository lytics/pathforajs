/** @module core/register-delayed-widget */

import initializeWidget from '../../widgets/init-widget'

export default function registerDelayedWidget (widget) {
  this.delayedWidgets[widget.id] = setTimeout(function () {
     initializeWidget(widget);
  }, widget.displayConditions.showDelay * 1000);
};
