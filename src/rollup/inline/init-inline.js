/** @module pathfora/inline/init-inline */

import window from '../dom/window';

export default function initializeInline () {
  var pf = this;

  this.onDOMready(function () {
    pf.addCallback(function () {
      if (pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        }
      }

      pf.inline.procElements();
    });
  });
}
