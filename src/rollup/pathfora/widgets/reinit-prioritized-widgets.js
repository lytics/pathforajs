/** @module pathfora/widgets/reinit-prioritized-widgets */

export default function reinitializePrioritizedWidgets() {
  if (core.prioritizedWidgets.length > 0) {

    core.prioritizedWidgets.sort(function (a, b) {
      return a.displayConditions.priority - b.displayConditions.priority;
    }).reverse();

    var highest = core.prioritizedWidgets[0].displayConditions.priority;

    for (var j = 0; j < core.prioritizedWidgets.length; j++) {
      if (core.prioritizedWidgets[j].displayConditions.priority === highest) {
        core.initializeWidget(core.prioritizedWidgets[j]);
      } else {
        break;
      }
    }
  }
};
