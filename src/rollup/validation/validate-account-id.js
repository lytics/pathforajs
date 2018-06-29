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
  if (typeof pf.acctid === 'undefined' || pf.acctid === '') {
    if (window.lio && window.lio.account) {
      if (
        typeof window.lio.account.id === 'undefined' ||
        window.lio.account.id === ''
      ) {
        throw new Error('Lytics Javascript tag returned an empty account id.');
      }

      pf.acctid = window.lio.account.id;
    } else {
      throw new Error('Could not get account id from Lytics Javascript tag.');
    }
  }
}