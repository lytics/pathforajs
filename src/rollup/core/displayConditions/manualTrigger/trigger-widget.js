/** @module core/displayConditions/manualTrigger/trigger-widget */

export default function triggerWidget (widget) {
  return core.validateWatchers(widget, function () {
    context.pathfora.triggeredWidgets[widget.id] = false;

    // remove from the ready widgets list
    core.readyWidgets.some(function (w, i) {
      if (w.id === widget.id) {
        core.readyWidgets.splice(i, 1);
        return true;
      }
    });
  });
};