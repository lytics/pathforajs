/** @module core/impressions-checker */

import { PREFIX_IMPRESSION } from '../../globals/config'
import readCookie from '../../utils/cookies/read-cookie'

export default function impressionsChecker (impressionConstraints, widget) {
  var parts, totalImpressions,
      valid = true,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = readCookie(id),
      now = Date.now();

  if (!sessionImpressions) {
    sessionImpressions = 0;
  }

  if (!total) {
    totalImpressions = 0;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10);

    if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) < impressionConstraints.buffer) {
      valid = false;
    }
  }

  if (sessionImpressions >= impressionConstraints.session || totalImpressions >= impressionConstraints.total) {
    valid = false;
  }

  return valid;
};