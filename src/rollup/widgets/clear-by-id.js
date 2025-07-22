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

  // Clean up widgets from all other tracker arrays and objects
  widgetIds.forEach(function (widgetId) {

    // Remove from initializedWidgets (stores widget IDs)
    var initializedIndex = widgetTracker.initializedWidgets.indexOf(widgetId);
    if (initializedIndex !== -1) {
      widgetTracker.initializedWidgets.splice(initializedIndex, 1);
    }

    // Remove from prioritizedWidgets (stores widget objects)
    for (var i = widgetTracker.prioritizedWidgets.length - 1; i >= 0; i--) {
      if (widgetTracker.prioritizedWidgets[i].id === widgetId) {
        widgetTracker.prioritizedWidgets.splice(i, 1);
      }
    }

    // Remove from readyWidgets (stores widget objects)
    for (var j = widgetTracker.readyWidgets.length - 1; j >= 0; j--) {
      if (widgetTracker.readyWidgets[j].id === widgetId) {
        widgetTracker.readyWidgets.splice(j, 1);
      }
    }

    // Remove from triggeredWidgets (object with widget ID keys)
    if (widgetTracker.triggeredWidgets.hasOwnProperty(widgetId)) {
      delete widgetTracker.triggeredWidgets[widgetId];
    }

    // Remove from dependentDataWidgets (object with widget ID keys)
    if (widgetTracker.dependentDataWidgets.hasOwnProperty(widgetId)) {
      delete widgetTracker.dependentDataWidgets[widgetId];
    }
  });
} 