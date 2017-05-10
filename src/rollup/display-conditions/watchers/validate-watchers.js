/** @module pathfora/display-conditions/watchers/core/validate-watchers */

import showWidget from '../../widgets/show-widget';

import impressionsChecker from '../impressions/impressions-checker';

export default function validateWatchers (widget, cb) {
  var valid = true;

  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
      valid = widget.valid && widget.watchers[key].check();
    }
  }

  if (widget.displayConditions.impressions && valid) {
    valid = impressionsChecker(widget.displayConditions.impressions, widget);
  }

  if (valid) {
    showWidget(widget);
    widget.valid = false;
    cb();

    return true;
  }

  return false;
}
