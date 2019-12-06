/** @module pathfora/display-conditions/exit-intent/register-exit-intent-watcher */

/**
 * Setup watcher for showOnExitIntent
 * display condition
 *
 * @exports registerExitIntentWatcher
 * @params {string} selector
 * @params {object} widget
 * @returns {object} watcher
 */
export default function registerExitIntentWatcher () {
  var watcher = {
    positions: [],
    check: function (e) {
      if (e != null) {
        var from = e.relatedTarget || e.toElement;

        // When there is registered movement and leaving the root element
        if (watcher.positions.length > 1 && (!from || from.nodeName === 'HTML')) {

          var y = watcher.positions[watcher.positions.length - 1].y;
          var py = watcher.positions[watcher.positions.length - 2].y;
          var ySpeed = Math.abs(y - py);

          watcher.positions = [];

          // Did the cursor move up?
          // Is it reasonable to believe that it left the top of the page, given the position and the speed?
          if (y - ySpeed <= 50 && y < py) {
            return true;
          }
        }
      }
      return false;
    }
  };

  return watcher;
}
