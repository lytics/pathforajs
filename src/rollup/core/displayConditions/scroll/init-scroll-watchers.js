/** @module core/init-scroll-watchers */

import validateWatchers from '../watchers/validate-watchers'

export default function initializeScrollWatchers (widget) {
  var core = this;
  if (!core.scrollListener) {
    widget.scrollListener = function () {
      validateWatchers(widget, function () {
        if (typeof document.addEventListener === 'function') {
          document.removeEventListener('scroll', widget.scrollListener);
        } else {
          context.onscroll = null;
        }
      });
    };

    // FUTURE Discuss https://www.npmjs.com/package/ie8 polyfill
    if (typeof context.addEventListener === 'function') {
      context.addEventListener('scroll', widget.scrollListener, false);
    } else {
      context.onscroll = widget.scrollListener;
    }
  }
  return true;
};