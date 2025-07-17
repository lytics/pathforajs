/** @module pathfora/widgets/cancel-delayed-widgets */

// globals
import {
  widgetTracker
} from '../globals/config';

// display conditions
import cancelDelayedWidget from '../display-conditions/cancel-delayed-widget';

/**
 * Cancel delayed widgets by their IDs
 *
 * @exports cancelDelayedWidgets
 * @param {Array} widgetIds - Array of widget IDs to cancel
 */
export default function cancelDelayedWidgets (widgetIds) {
  if (!Array.isArray(widgetIds)) {
    console.warn('cancelDelayedWidgets: widgetIds must be an array');
    return;
  }

  var delayed = widgetTracker.delayedWidgets;

  widgetIds.forEach(function (id) {
    if (delayed.hasOwnProperty(id)) {
      cancelDelayedWidget(id);
    }
  });
} 