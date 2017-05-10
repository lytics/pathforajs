/** @module pathfora/display-conditions/manual-trigger/register-manual-trigger-watcher */

import { widgetTracker } from '../../globals/config';

import removeWatcher from '../watchers/remove-watcher';

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
