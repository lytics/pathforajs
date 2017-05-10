/** @module config/default-props */

export default function getWidgetTracker (obj) {
  if (!obj) {
    obj = {};
  }

  obj = {
    delayedWidgets: {},
    openedWidgets: [],
    initializedWidgets: [],
    prioritizedWidgets: [],
    readyWidgets: [],
    triggeredWidgets: {}
  };

  return obj;
};