/** @module config/default-props */

export default function resetDataObject (obj) {
  if (!obj) {
    obj = {};
  }

  obj = {
    pageViews: 0,
    timeSpentOnPage: 0,
    closedWidgets: [],
    completedActions: [],
    cancelledActions: [],
    displayedWidgets: [],
    abTestingGroups: [],
    socialNetworks: {}
  };

  return obj;
};