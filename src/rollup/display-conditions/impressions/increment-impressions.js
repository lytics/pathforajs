/** @module core/increment-impressions */

import { PREFIX_IMPRESSION } from '../../globals/config'
import readCookie from '../../utils/cookies/read-cookie'
import saveCookie from '../../utils/cookies/save-cookie'

export default function incrementImpressions (widget) {
  var parts, totalImpressions,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 1;
  } else {
    sessionImpressions += 1;
  }

  if (!total) {
    totalImpressions = 1;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10) + 1;
  }

  sessionStorage.setItem(id, sessionImpressions);
  saveCookie(id, Math.min(totalImpressions, 9998) + '|' + now, widget.expiration);
};