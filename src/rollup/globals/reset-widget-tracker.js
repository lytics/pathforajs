/** @module pathfora/globals/reset-widget-tracker */

export default function resetWidgetTracker (obj) {
  obj.delayedWidgets = {};
  obj.openedWidgets = [];
  obj.initializedWidgets = [];
  obj.prioritizedWidgets = [];
  obj.readyWidgets = [];
  obj.triggeredWidgets = {};

  return obj;
}
