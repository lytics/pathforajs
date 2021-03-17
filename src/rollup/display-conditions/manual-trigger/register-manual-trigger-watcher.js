/** @module pathfora/display-conditions/manual-trigger/register-manual-trigger-watcher */

// globals
import { widgetTracker } from '../../globals/config';

/**
 * Begin watching for a custom javascript trigger
 *
 * @exports registerManualTriggerWatcher
 * @params {object} widget
 * @params {boolean} value
 * @returns {object} watcher
 */
export default function registerManualTriggerWatcher (value, widget) {
  var watcher = {
    check: function () {
      if (value && widgetTracker.triggeredWidgets[widget.id] || widgetTracker.triggeredWidgets['*']) {
        return true;
      }
      return false;
    }
  };

  return watcher;
}
