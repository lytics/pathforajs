/** @module core/validate-watchers */

export default function validateWatchers (widget, cb) {
  var valid = true;

  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
      valid = widget.valid && widget.watchers[key].check();
    }
  }

  if (widget.displayConditions.impressions && valid) {
    valid = core.impressionsChecker(widget.displayConditions.impressions, widget);
  }

  if (valid) {
    context.pathfora.showWidget(widget);
    widget.valid = false;
    cb();

    return true;
  }

  return false;
};