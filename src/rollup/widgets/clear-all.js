/** @module pathfora/widgets/clear-all */

// globals
import { widgetTracker, pathforaDataObject, defaultProps } from '../globals/config';
import resetDataObject from '../globals/reset-data-object';
import resetWidgetTracker from '../globals/reset-widget-tracker';
import resetDefaultProps from '../globals/reset-default-props';

// dom
import document from '../dom/document';

// utils
import removeClass from '../utils/class/remove-class';

// display conditions
import cancelDelayedWidget from '../display-conditions/cancel-delayed-widget';


/**
 * Close all widgets and reset all settings to default
 *
 * @exports clearAll
 */
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
