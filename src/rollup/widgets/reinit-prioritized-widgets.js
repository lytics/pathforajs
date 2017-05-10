/** @module pathfora/widgets/reinit-prioritized-widgets */

import { widgetTracker } from '../globals/config'

export default function reinitializePrioritizedWidgets() {
  if (widgetTracker.prioritizedWidgets.length > 0) {

    widgetTracker.prioritizedWidgets.sort(function (a, b) {
      return a.displayConditions.priority - b.displayConditions.priority;
    }).reverse();

    var highest = widgetTracker.prioritizedWidgets[0].displayConditions.priority;

    for (var j = 0; j < widgetTracker.prioritizedWidgets.length; j++) {
      if (widgetTracker.prioritizedWidgets[j].displayConditions.priority === highest) {
        this.initializeWidget(widgetTracker.prioritizedWidgets[j]);
      } else {
        break;
      }
    }
  }
};
