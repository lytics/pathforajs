/** @module pathfora/inline/init-inline */

// validation
import validateAccountId from '../validation/validate-account-id';

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
      validateAccountId(pf);
      pf.inline.procElements();
    });
  });
}
