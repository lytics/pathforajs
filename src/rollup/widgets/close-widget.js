/** @module pathfora/widgets/close-widget */

import document from '../dom/document';

import trackWidgetAction from '../data/tracking/track-widget-action';

import removeClass from '../utils/class/remove-class';
import hasClass from '../utils/class/has-class';

import { widgetTracker } from '../globals/config';


export default function closeWidget (id, noTrack) {
  var node = document.getElementById(id);

  // FIXME Change to Array#some or Array#filter
  for (var i = 0; i < widgetTracker.openedWidgets.length; i++) {
    if (widgetTracker.openedWidgets[i].id === id) {
      if (!noTrack) {
        trackWidgetAction('close', widgetTracker.openedWidgets[i]);
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
    }
  }, 500);
}
