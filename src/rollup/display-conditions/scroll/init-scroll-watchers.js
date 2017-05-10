/** @module core/init-scroll-watchers */

import validateWatchers from '../watchers/validate-watchers'
import window from '../../dom/window'

export default function initializeScrollWatchers (widget) {
  var core = this;
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
    window.addEventListener('scroll', widget.scrollListener, false);
  } else {
    window.onscroll = widget.scrollListener;
  }
  return true;
};