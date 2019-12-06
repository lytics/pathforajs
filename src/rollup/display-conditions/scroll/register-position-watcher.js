/** @module pathfora/display-conditions/scroll/register-position-watcher */

// dom
import document from '../../dom/document';

/**
 * Setup watcher for scrollPercentageToDisplay
 * display condition
 *
 * @exports registerPositionWatcher
 * @params {int} percent
 * @params {object} widget
 * @returns {object} watcher
 */
export default function registerPositionWatcher (percent) {
  var watcher = {
    check: function () {
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
          positionInPixels = height * (percent / 100),
          offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset >= positionInPixels) {
        return true;
      }
      return false;
    }
  };

  return watcher;
}
