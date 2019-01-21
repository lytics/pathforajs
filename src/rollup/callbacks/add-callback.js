/** @module pathfora/callbacks/add-callback */

import window from '../dom/window';

/**
 * Add a function to be called once jstag is loaded
 *
 * @exports addCallack
 * @params {function} cb
 */
export default function addCallback (cb) {
  if (window.lio && window.lio.loaded) {
    // legacy
    cb(window.lio.data);
    return;
  } else if (window.jstag && typeof window.jstag.getEntity === 'function') {
    // > jstag 3.0.0
    var entity = window.jstag.getEntity();
    if (entity.data && entity.data.user) {
      cb(entity.data.user);
      return;
    }
  }

  // fallback
  this.callbacks.push(cb);
}
