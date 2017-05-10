/** @module config/default-props */

export default function resetDataObject (obj) {
  obj.pageViews = 0;
  obj.timeSpentOnPage = 0;
  obj.closedWidgets = [];
  obj.completedActions = [];
  obj.cancelledActions = [];
  obj.displayedWidgets = [];
  obj.abTestingGroups = [];
  obj.socialNetworks = {};

  return obj;
};