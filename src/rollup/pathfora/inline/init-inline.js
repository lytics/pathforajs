/** @module pathfora/initialize-inline */

import window from '../../globals/window'

export default function initializeInline () {
  var pf = this;

  pf.onDOMready(function () {
    pf.addCallback(function () {
      if (pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        }
      }

      pf.inline.procElements();
    });
  });
};