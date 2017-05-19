/** @module pathfora/display-conditions/manual-trigger/trigger-widget */

import validateWatchers from '../watchers/validate-watchers';

import { widgetTracker } from '../../globals/config';

/**
 * Trigger a single "manualTrigger" widget to be shown
 *
 * @exports triggerWidget
 * @params {object} widget
 * @returns {boolean}
 */
export default function triggerWidget (widget) {
  return validateWatchers(widget, function () {
    widgetTracker.triggeredWidgets[widget.id] = false;

    // remove from the ready widgets list
    widgetTracker.readyWidgets.some(function (w, i) {
      if (w.id === widget.id) {
        widgetTracker.readyWidgets.splice(i, 1);
        return true;
      }
    });
  });
}
