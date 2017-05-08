/** @module pathfora/widgets/close-widget */

import document from '../../globals/document'

export default function closeWidget (id, noTrack) {
  var node = document.getElementById(id);

  // FIXME Change to Array#some or Array#filter
  for (var i = 0; i < core.openedWidgets.length; i++) {
    if (core.openedWidgets[i].id === id) {
      if (!noTrack) {
        core.trackWidgetAction('close', core.openedWidgets[i]);
      }
      core.openedWidgets.splice(i, 1);
      break;
    }
  }

  utils.removeClass(node, 'opened');

  if (utils.hasClass(node, 'pf-has-push-down')) {
    var pushDown = document.querySelector('.pf-push-down');
    if (pushDown) {
      utils.removeClass(pushDown, 'opened');
    }
  }

  // FIXME 500 - magical number
  setTimeout(function () {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }, 500);
};