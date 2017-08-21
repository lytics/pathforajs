/** @module pathfora/widgets/actions/update-action-cookie */

import saveCookie from '../../utils/cookies/save-cookie';
import readCookie from '../../utils/cookies/read-cookie';

/**
 * Increase the value count of the actions
 * saves as cookies
 *
 * @exports updateActionCookie
 * @params {string} name
 * @params {object} expiration
 */

export default function updateActionCookie (name, expiration) {
  var ct,
      val = readCookie(name),
      duration = Date.now();

  if (val) {
    val = val.split('|');
    ct = Math.min(parseInt(val[0], 10), 9998) + 1;
  } else {
    ct = 1;
  }

  saveCookie(name, ct + '|' + duration, expiration);
}
