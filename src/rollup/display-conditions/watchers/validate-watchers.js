/** @module pathfora/display-conditions/watchers/validate-watchers */

// globals
import { widgetTracker } from '../../globals/config';

// display conditions
import impressionsChecker from '../impressions/impressions-checker';

// widgets
import showWidget from '../../widgets/show-widget';

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
    if (widget.displayConditions.showDelay) {
      widgetTracker.delayedWidgets[widget.id] = setTimeout(function () {
        showWidget(widget);
      }, widget.displayConditions.showDelay * 1000);
    } else {
      showWidget(widget);
    }

    widget.valid = false;
    cb();

    return true;
  }

  return false;
}
