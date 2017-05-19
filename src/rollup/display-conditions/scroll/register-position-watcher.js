/** @module pathfora/display-conditions/scroll/register-position-watcher */

import document from '../../dom/document';

import removeWatcher from '../watchers/remove-watcher';

/**
 * Setup watcher for scrollPercentageToDisplay
 * display condition
 *
 * @exports registerPositionWatcher
 * @params {int} percent
 * @params {object} widget
 * @returns {object} watcher
 */
export default function registerPositionWatcher (percent, widget) {
  var watcher = {
    check: function () {
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
          positionInPixels = height * (percent / 100),
          offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset >= positionInPixels) {
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}
