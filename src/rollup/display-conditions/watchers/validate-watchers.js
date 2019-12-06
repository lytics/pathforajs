/** @module pathfora/display-conditions/watchers/validate-watchers */

// display conditions
import impressionsChecker from '../impressions/impressions-checker';

// widgets
import showWidget from '../../widgets/show-widget';

export default function validateWatchers (widget, cb, e) {
  var valid = true;

  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && widget.watchers[key] !== null) {
      valid = valid && widget.valid && widget.watchers[key].check(e);
    }
  }

  if (widget.displayConditions.impressions && valid) {
    valid = impressionsChecker(widget.displayConditions.impressions, widget);
  }

  if (valid) {
    showWidget(widget);
    widget.valid = false;
    cb();
    widget.watchers = [];

    return true;
  }

  return false;
}
