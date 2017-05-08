/** @module core/register-position-watcher */

export default function registerPositionWatcher (percent, widget) {
  var watcher = {
    check: function () {
      var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
          positionInPixels = height * (percent / 100),
          offset = document.documentElement.scrollTop || document.body.scrollTop;

      if (offset >= positionInPixels) {
        core.removeWatcher(watcher, widget);
        return true;
      }
      return false;
    }
  };

  return watcher;
};
