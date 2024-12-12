/** @module pathfora/callbacks/add-callback */

import window from '../dom/window';

/**
 * Add a function to be called once jstag is loaded
 *
 * @exports addCallack
 * @params {function} cb
 */
export default function addCallback(cb) {
  if (window.lio && window.lio.loaded) {
    // legacy
    cb(window.lio.data);
    return;
  } else if (window.jstag && typeof window.jstag.getEntity === 'function') {
    if ('entityReady' in window.jstag) {
      window.jstag.entityReady(function (e) {
        if (e.data && e.data.user) {
          cb(e.data.user);
        }
      });
    } else {
      var entity = window.jstag.getEntity();
      if (entity.data && entity.data.user) {
        cb(entity.data.user);
      }
    }
  }

  // fallback
  this.callbacks.push(cb);
}
