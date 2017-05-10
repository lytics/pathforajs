/** @module pathfora/initialize-inline */

import lio from '../globals/lio'

export default function initializeInline () {
  var pf = this;

  this.onDOMready(function () {
    pf.addCallback(function () {
      if (pf.acctid === '') {
        if (lio && lio.account) {
          pf.acctid = lio.account.id;
        }
      }

      pf.inline.procElements();
    });
  });
};