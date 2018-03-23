/** @module pathfora/widgets/close-widget */

// globals
import { widgetTracker } from '../globals/config';

// dom
import document from '../dom/document';

// utils
import removeClass from '../utils/class/remove-class';
import hasClass from '../utils/class/has-class';

// data
import trackWidgetAction from '../data/tracking/track-widget-action';

/**
 * Close a widget and remove it from the dom
 *
 * @exports closeWidget
 * @params {string} id
 * @params {boolean} noTrack
 */
export default function closeWidget (id, noTrack) {
  var i,
      node = document.getElementById(id);

  // FIXME Change to Array#some or Array#filter
  for (i = 0; i < widgetTracker.openedWidgets.length; i++) {
    if (widgetTracker.openedWidgets[i].id === id) {
      if (!noTrack) {
        trackWidgetAction('close', widgetTracker.openedWidgets[i]);
      }

      for (var key in widgetTracker.openedWidgets[i].listeners) {
        if (widgetTracker.openedWidgets[i].listeners.hasOwnProperty(key)) {
          var val = widgetTracker.openedWidgets[i].listeners[key];
          val.target.removeEventListener(val.type, val.fn);
        }
      }

      widgetTracker.openedWidgets.splice(i, 1);
      break;
    }
  }

  removeClass(node, 'opened');

  if (hasClass(node, 'pf-has-push-down')) {
    var pushDown = document.querySelector('.pf-push-down');
    if (pushDown) {
      removeClass(pushDown, 'opened');
    }
  }

  // FIXME 500 - magical number
  setTimeout(function () {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);

      for (i = 0; i < widgetTracker.initializedWidgets.length; i++) {
        if (widgetTracker.initializedWidgets[i] === id) {
          widgetTracker.initializedWidgets.splice(i, 1);
        }
      }
    }
  }, 500);
}
