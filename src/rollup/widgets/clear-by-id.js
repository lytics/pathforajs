/** @module pathfora/widgets/clear-by-id */

// globals
import {
  widgetTracker
} from '../globals/config';

// widgets
import clearWidget from './clear-widget';
import cancelDelayedWidgets from './cancel-delayed-widgets';

/**
 * Close specific widgets by their IDs and clean up their resources
 *
 * @exports clearById
 * @param {Array} widgetIds - Array of widget IDs to clear
 */
export default function clearById (widgetIds) {
  if (!Array.isArray(widgetIds)) {
    console.warn('clearById: widgetIds must be an array');
    return;
  }

  var opened = widgetTracker.openedWidgets,
      widgetsToRemove = [];

  // Find widgets to remove from opened widgets
  opened.forEach(function (widget) {
    if (widgetIds.indexOf(widget.id) !== -1) {
      widgetsToRemove.push(widget);
    }
  });

  // Clear the found widgets
  clearWidget(widgetsToRemove);

  // Cancel delayed widgets that match the IDs
  cancelDelayedWidgets(widgetIds);
} 