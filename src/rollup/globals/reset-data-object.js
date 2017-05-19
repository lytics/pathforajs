/** @module pathfora/globals/reset-data-object */

/**
 * Reset the pathforaDataObject to an empty state
 *
 * @exports resetDataObject
 * @params {object} obj
 * @returns {object} obj
 */
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
}
