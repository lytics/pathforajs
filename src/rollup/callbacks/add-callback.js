/** @module pathfora/callbacks/add-callback */

import window from '../dom/window';

export default function addCallback (cb) {
  if (window.lio && window.lio.loaded) {
    cb(window.lio.data);
  } else {
    this.callbacks.push(cb);
  }
}
