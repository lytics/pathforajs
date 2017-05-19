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
    cb(window.lio.data);
  } else {
    this.callbacks.push(cb);
  }
}
