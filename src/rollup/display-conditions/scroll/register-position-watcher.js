/** @module pathfora/display-conditions/scroll/register-position-watcher */

// dom
import document from '../../dom/document';

import getScrollingElement from '../../utils/get-scrolling-element';

/**
 * Setup watcher for scrollPercentageToDisplay
 * display condition
 *
 * @exports registerPositionWatcher
 * @params {int} percent
 * @params {object} widget
 * @returns {object} watcher
 */
export default function registerPositionWatcher(percent) {
  var watcher = {
    check: function () {
      /* istanbul ignore next */
      var scrollingElement = document.scrollingElement || getScrollingElement(),
        scrollTop = scrollingElement.scrollTop,
        scrollHeight = scrollingElement.scrollHeight,
        clientHeight = scrollingElement.clientHeight,
        percentageScrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;

      // if NaN, will always return `false`
      return percentageScrolled >= percent;
    },
  };

  return watcher;
}
