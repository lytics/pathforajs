/** @module pathfora/display-conditions/init-exit-intent */

// dom
import document from '../../dom/document';

// utils
import eventHub from '../../utils/event-hub';

// display conditions
import validateWatchers from '../watchers/validate-watchers';

/**
 * Setup exitIntent for a widget
 *
 * @exports initExitIntent
 * @params {object} widget
 * @returns {boolean}
 */
export default function initializeExitIntent (widget, watcher) {
  if (!widget.exitIntentListener) {
    widget.exitIntentListener = function (e) {
      watcher.positions.push({
        x: e.clientX,
        y: e.clientY
      });
      if (watcher.positions.length > 30) {
        watcher.positions.shift();
      }
    };

    widget.exitIntentTrigger = function (e) {
      validateWatchers(widget, function () {
        if (typeof document.removeEventListener === 'function') {
          eventHub.remove(document, 'mousemove', widget.exitIntentListener);
          eventHub.remove(document, 'mouseout', widget.exitIntentTrigger);
        } else {
          document.onmousemove = null;
          document.onmouseout = null;
        }
      }, e);
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
