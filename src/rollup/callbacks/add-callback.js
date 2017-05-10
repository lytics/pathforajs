/** @module pathfora/add-callback */

import lio from '../globals/lio'

export default function addCallback (cb) {
  if (lio && lio.loaded) {
    cb(lio.data);
  } else {
    this.callbacks.push(cb);
  }
};