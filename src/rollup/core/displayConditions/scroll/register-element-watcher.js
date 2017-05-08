/** @module core/register-element-watcher */

export default function registerElementWatcher (selector, widget) {
  var watcher = {
    elem: document.querySelector(selector),

    check: function () {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
          scrolledToBottom = window.innerHeight + scrollTop >= document.body.offsetHeight;

      if (watcher.elem.offsetTop - window.innerHeight / 2 <= scrollTop || scrolledToBottom) {
        core.removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
};