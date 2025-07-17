/** @module pathfora/widgets/clear-widget */

// globals
import {
  widgetTracker
} from '../globals/config';

// dom
import document from '../dom/document';

// utils
import removeClass from '../utils/class/remove-class';

/**
 * Clear specific widgets from DOM and clean up their resources
 *
 * @exports clearWidget
 * @param {Array} widgets - Array of widget objects to clear
 */
export default function clearWidget (widgets) {
  if (!Array.isArray(widgets)) {
    console.warn('clearWidget: widgets must be an array');
    return;
  }

  var opened = widgetTracker.openedWidgets,
      widgetsToRemove = [];

  // Find widgets to remove from opened widgets
  opened.forEach(function (widget, index) {
    if (widgets.indexOf(widget) !== -1) {
      widgetsToRemove.push({ widget: widget, index: index });
    }
  });

  // Remove widgets from DOM and clean up listeners
  widgetsToRemove.forEach(function (item) {
    var widget = item.widget;
    var element = document.getElementById(widget.id);
    
    if (element) {
      removeClass(element, 'opened');
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    // Clean up event listeners
    for (var key in widget.listeners) {
      if (widget.listeners.hasOwnProperty(key)) {
        var val = widget.listeners[key];
        val.target.removeEventListener(val.type, val.fn);
      }
    }
  });

  // Remove widgets from openedWidgets array (in reverse order to maintain indices)
  widgetsToRemove.sort(function (a, b) {
    return b.index - a.index;
  }).forEach(function (item) {
    opened.splice(item.index, 1);
  });

  return widgetsToRemove;
} 