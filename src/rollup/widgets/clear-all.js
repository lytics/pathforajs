/** @module pathfora/widgets/clear-all */

import document from '../dom/document';

import removeClass from '../utils/class/remove-class';

import cancelDelayedWidget from '../display-conditions/delay/cancel-delayed-widget';

import { widgetTracker, pathforaDataObject, defaultProps } from '../globals/config';
import resetDataObject from '../globals/reset-data-object';
import resetWidgetTracker from '../globals/reset-widget-tracker';
import resetDefaultProps from '../globals/reset-default-props';


export default function clearAll () {
  var opened = widgetTracker.openedWidgets,
      delayed = widgetTracker.delayedWidgets;

  opened.forEach(function (widget) {
    var element = document.getElementById(widget.id);
    removeClass(element, 'opened');
    element.parentNode.removeChild(element);
  });

  opened.slice(0);

  for (var i = delayed.length; i > -1; i--) {
    cancelDelayedWidget(delayed[i]);
  }

  resetWidgetTracker(widgetTracker);
  resetDataObject(pathforaDataObject);
  resetDefaultProps(defaultProps);
}
