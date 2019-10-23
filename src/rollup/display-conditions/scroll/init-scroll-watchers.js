/** @module pathfora/display-conditions/scroll/init-scroll-watchers */

import eventHub from '../../utils/event-hub';

// dom
import window from '../../dom/window';

// display conditions
import validateWatchers from '../watchers/validate-watchers';

/**
 * Add event listener for scroll display conditions
 *
 * @exports initializeScrollWatchers
 * @params {object} widget
 * @returns {boolean}
 */
export default function initializeScrollWatchers (widget) {
  widget.scrollListener = function () {
    validateWatchers(widget, function () {
      if (typeof window.addEventListener === 'function') {
        window.removeEventListener('scroll', widget.scrollListener);
      } else {
        window.onscroll = null;
      }
    });
  };

  // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
  if (typeof window.addEventListener === 'function') {
    eventHub.add(window, 'scroll', widget.scrollListener);
  } else {
    window.onscroll = widget.scrollListener;
  }
  return true;
}
