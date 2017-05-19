/** @module pathfora/display-conditions/manual-trigger/register-manual-trigger-watcher */

import { widgetTracker } from '../../globals/config';

import removeWatcher from '../watchers/remove-watcher';

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
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}
