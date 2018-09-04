/** @module pathfora/display-conditions/impressions/impressions-checker */

// globals
import { PREFIX_IMPRESSION } from '../../globals/config';

// utils
import readCookie from '../../utils/cookies/read-cookie';

/**
 * Check if the widget has met the impressions
 * display condition.
 *
 * @exports impressionsChecker
 * @params {object} impressionConstraints
 * @params {object} widget
 * @params {boolean} valid
 */
export default function impressionsChecker (impressionConstraints, widget) {
  var parts,
      totalImpressions,
      valid = true,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      sessionImpressionsForAllWidgets = 0,
      total = readCookie(id),
      now = Date.now();

  // retain backwards compatibility if using legacy method of:
  impressionConstraints.widget = impressionConstraints.widget || {};
  impressionConstraints.global = impressionConstraints.global || {};

  // migrate impressions.session to impressions.widget.session if not also set
  if (typeof impressionConstraints.widget.session === 'undefined') {
    impressionConstraints.widget.session = impressionConstraints.session;
  }
  // migrate impressions.total to impressions.widget.total if not also set
  if (typeof impressionConstraints.widget.total === 'undefined') {
    impressionConstraints.widget.total = impressionConstraints.total;
  }
  // migrate impressions.buffer to impressions.widget.buffer if not also set
  if (typeof impressionConstraints.widget.buffer === 'undefined') {
    impressionConstraints.widget.buffer = impressionConstraints.buffer;
  }

  // widget specific session total
  if (!sessionImpressions) {
    sessionImpressions = 0;
  }

  // widget specific historic total
  if (!total) {
    totalImpressions = 0;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10);

    if (
      typeof parts[1] !== 'undefined' &&
      Math.abs(parts[1] - now) / 1000 < impressionConstraints.widget.buffer
    ) {
      valid = false;
    }
  }

  // all widget session total
  if (impressionConstraints.global.session > 0) {
    for (var i = 0; i < ~~sessionStorage.length; i++) {
      var k = sessionStorage.key(i);
      if (typeof k !== 'undefined' && k.includes(PREFIX_IMPRESSION)) {
        sessionImpressionsForAllWidgets =
          sessionImpressionsForAllWidgets + ~~sessionStorage.getItem(k);
      }
    }
  }

  if (
    sessionImpressions >= impressionConstraints.widget.session ||
    totalImpressions >= impressionConstraints.widget.total ||
    sessionImpressionsForAllWidgets >= impressionConstraints.global.session
  ) {
    valid = false;
  }

  return valid;
}
