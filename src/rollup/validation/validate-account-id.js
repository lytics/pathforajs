/** @module pathfora/validation/validate-account-id */

// dom
import window from '../dom/window';

/**
 * Validate and set the Lytics account Id
 *
 * @exports validateAccountId
 * @params {object} pf
 */
export default function validateAccountId (pf) {
  var acctid;

  // in the legacy javascript tag < 2.0, there is an lio object surfaced that holds the account id.
  // in > 3.0 this lio object is only available for backwards compatibility and not the main source
  // of truth. we should be getting the cid that is passed to the config, which is an array, by default
  // we can assume the first cid in the array is the one to be used for personalization and such.
  if (typeof pf.acctid === 'undefined' || pf.acctid === '') {
    if (window.lio && window.lio.account) {
      // tag is legacy
      acctid = window.lio.account.id;
    } else if (
      // tag is current gen
      window.jstag &&
      window.jstag.config &&
      window.jstag.config.cid &&
      window.jstag.config.cid.length > 0
    ) {
      acctid = window.jstag.config.cid[0];
    } else {
      throw new Error('Could not get account id from Lytics Javascript tag.');
    }

    // make sure we have a valid acctid before setting
    if (!!acctid) {
      pf.acctid = acctid;
    } else {
      throw new Error('Lytics Javascript tag returned an empty account id.');
    }
  }
}
