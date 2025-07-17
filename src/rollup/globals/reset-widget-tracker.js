/** @module pathfora/globals/reset-widget-tracker */

/**
 * Reset the widgetTracker to an empty state
 *
 * @exports resetDefaultProps
 * @params {object} obj
 * @returns {object} obj
 */
export default function resetWidgetTracker (obj) {
  obj.delayedWidgets = {};
  obj.openedWidgets = [];
  obj.initializedWidgets = [];
  obj.prioritizedWidgets = [];
  obj.readyWidgets = [];
  obj.triggeredWidgets = {};
  obj.dependentDataWidgets = [];

  return obj;
}
