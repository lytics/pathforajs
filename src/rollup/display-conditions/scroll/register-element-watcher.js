/** @module pathfora/display-conditions/scroll/register-element-watcher */

// dom
import document from '../../dom/document';
import window from '../../dom/window';

// display conditions
import removeWatcher from '../watchers/remove-watcher';

/**
 * Setup watcher for displayWhenElementVisible
 * display condition
 *
 * @exports registerElementWatcher
 * @params {string} selector
 * @params {object} widget
 * @returns {object} watcher
 */
export default function registerElementWatcher (selector, widget) {
  var watcher = {
    elem: document.querySelector(selector),

    check: function () {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
          scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;

      if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
        removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
}
