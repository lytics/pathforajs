/** @module pathfora/widgets/actions/update-action-cookie */

import write from '../../utils/persist/write';
import read from '../../utils/persist/read';

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
      val = read(name),
      duration = Date.now();

  if (val) {
    val = val.split('|');
    ct = Math.min(parseInt(val[0], 10), 9998) + 1;
  } else {
    ct = 1;
  }

  write(name, ct + '|' + duration, expiration);
}
