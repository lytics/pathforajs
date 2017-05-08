/** @module core/register-manual-trigger-watcher */

export default function registerManualTriggerWatcher (value, widget) {
  var watcher = {
    check: function () {
      if (value && context.pathfora && context.pathfora.triggeredWidgets[widget.id] || context.pathfora.triggeredWidgets['*']) {
        core.removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
};