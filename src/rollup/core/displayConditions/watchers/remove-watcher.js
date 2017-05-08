/** @module core/remove-watcher */

export default function removeWatcher (watcher, widget) {
  for (var key in widget.watchers) {
    if (widget.watchers.hasOwnProperty(key) && watcher === widget.watchers[key]) {
      widget.watchers.splice(key, 1);
    }
  }
};