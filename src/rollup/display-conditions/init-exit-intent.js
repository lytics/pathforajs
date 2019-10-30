/** @module pathfora/display-conditions/init-exit-intent */

import eventHub from '../utils/event-hub';

// dom
import document from '../dom/document';

// display conditions
import validateWatchers from './watchers/validate-watchers';

/**
 * Setup exitIntent for a widget
 *
 * @exports initExitIntent
 * @params {object} widget
 * @returns {boolean}
 */
export default function initializeExitIntent (widget) {
  var positions = [];
  if (!widget.exitIntentListener) {
    widget.exitIntentListener = function (e) {
      positions.push({
        x: e.clientX,
        y: e.clientY
      });
      if (positions.length > 30) {
        positions.shift();
      }
    };

    widget.exitIntentTrigger = function (e) {
      var from = e.relatedTarget || e.toElement;

      // When there is registered movement and leaving the root element
      if (positions.length > 1 && (!from || from.nodeName === 'HTML')) {
        var valid;

        var y = positions[positions.length - 1].y;
        var py = positions[positions.length - 2].y;
        var ySpeed = Math.abs(y - py);

        // Did the cursor move up?
        // Is it reasonable to believe that it left the top of the page, given the position and the speed?
        valid = widget.valid && y - ySpeed <= 50 && y < py;

        if (valid) {
          validateWatchers(widget, function () {
            if (typeof document.addEventListener === 'function') {
              eventHub.remove(document, 'mousemove', widget.exitIntentListener);
              eventHub.remove(document, 'mouseout', widget.exitIntentTrigger);
            } else {
              document.onmousemove = null;
              document.onmouseout = null;
            }
          });
        }

        positions = [];
      }
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof document.addEventListener === 'function') {
      eventHub.add(document, 'mousemove', widget.exitIntentListener);
      eventHub.add(document, 'mouseout', widget.exitIntentTrigger);
    } else {
      document.onmousemove = widget.exitIntentListener;
      document.onmouseout = widget.exitIntentTrigger;
    }
  }
  return true;
}
