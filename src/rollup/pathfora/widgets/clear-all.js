/** @module pathfora/widgets/clear-all */

import document from '../../globals/document'

export default function clearAll () {
  var opened = core.openedWidgets,
      delayed = core.delayedWidgets;

  opened.forEach(function (widget) {
    var element = document.getElementById(widget.id);
    utils.removeClass(element, 'opened');
    element.parentNode.removeChild(element);
  });

  opened.slice(0);

  for (var i = delayed.length; i > -1; i--) {
    core.cancelDelayedWidget(delayed[i]);
  }

  core.openedWidgets = [];
  core.initializedWidgets = [];

  pathforaDataObject = {
    pageViews: 0,
    timeSpentOnPage: 0,
    closedWidgets: [],
    completedActions: [],
    cancelledActions: [],
    displayedWidgets: [],
    abTestingGroups: [],
    socialNetworks: {}
  };

  if (originalConf) {
    defaultProps = originalConf;
  }
};