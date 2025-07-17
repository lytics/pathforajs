/** @module pathfora/widgets/clear-all */

// globals
import {
  widgetTracker,
  pathforaDataObject,
  defaultProps
} from '../globals/config';
import resetDataObject from '../globals/reset-data-object';
import resetWidgetTracker from '../globals/reset-widget-tracker';
import resetDefaultProps from '../globals/reset-default-props';
import eventHub from '../utils/event-hub';

// widgets
import clearWidget from './clear-widget';
import cancelDelayedWidgets from './cancel-delayed-widgets';

/**
 * Close all widgets and reset all settings to default
 *
 * @exports clearAll
 */
export default function clearAll () {
  var opened = widgetTracker.openedWidgets,
      delayed = widgetTracker.delayedWidgets;

  // Clear all opened widgets
  clearWidget(opened);

  // Cancel all delayed widgets
  var delayedIds = Object.keys(delayed);
  cancelDelayedWidgets(delayedIds);

  eventHub.removeAll();

  resetWidgetTracker(widgetTracker);
  resetDataObject(pathforaDataObject);
  resetDefaultProps(defaultProps);
  this.callbacks = [];
  this.acctid = '';
}
