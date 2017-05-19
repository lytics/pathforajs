/** @module pathfora/inline/init-inline */

import window from '../dom/window';

/**
 * Once the dom is ready and Lytics jstag is
 * loaded initialize inline personalization
 *
 * @exports initializeInline
 */
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
