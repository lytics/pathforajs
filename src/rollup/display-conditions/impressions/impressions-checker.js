/** @module pathfora/display-conditions/impressions/impressions-checker */

// globals
import { PREFIX_IMPRESSION, PREFIX_TOTAL_IMPRESSIONS_SINCE } from '../../globals/config';

// utils
import read from '../../utils/persist/read';
import write from '../../utils/persist/write';

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
      since,
      id = PREFIX_IMPRESSION + widget.id,
      sinceId = PREFIX_TOTAL_IMPRESSIONS_SINCE + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      sessionImpressionsForAllWidgets = 0,
      impressionsForAllWidgets = 0,
      lastImpressionTimeForAllWidgets = 0,
      total = read(id),
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

  // maintain and overwrite the "total since" value for impressions.global.duration
  if (impressionConstraints.global.total > 0 && impressionConstraints.global.duration > 0) {
    since = read(sinceId);

    var resetImpressions = function () {
      write(
        sinceId,
        '0|' + now,
        widget.expiration
      );
    };

    if (!since) {
      resetImpressions();
    } else {
      parts = since.split('|');
      if (typeof parts[1] !== 'undefined' && (Math.abs(parts[1] - now) / 1000) >= impressionConstraints.global.duration) {
        resetImpressions();
      }
    }
  }

  if (!sessionImpressions) {
    sessionImpressions = 0;
  }

  // check for impressions.widget.session
  if (sessionImpressions >= impressionConstraints.widget.session) {
    return false;
  }

  // widget specific historic total
  if (!total) {
    totalImpressions = 0;
  } else {
    parts = total.split('|');
    totalImpressions = parseInt(parts[0], 10);

    // check for impressions.widget.buffer
    if (typeof parts[1] !== 'undefined') {
      if (impressionConstraints.widget.buffer > 0 && (Math.abs(parts[1] - now) / 1000 < impressionConstraints.widget.buffer)) {
        return false;
      }

      // check for impressions.widget.duration
      if (
        impressionConstraints.widget.duration > 0 &&
        totalImpressions % impressionConstraints.widget.total === 0 &&
        Math.abs(parts[1] - now) / 1000 < impressionConstraints.widget.duration
      ) {
        return false;
      }
    }
  }

  // check for impressions.widget.total
  if (totalImpressions >= impressionConstraints.widget.total && typeof impressionConstraints.widget.duration === 'undefined') {
    return false;
  }

  // all widgets session total
  if (impressionConstraints.global.session > 0) {
    for (var i = 0; i < ~~sessionStorage.length; i++) {
      var k = sessionStorage.key(i);
      if (typeof k !== 'undefined' && k.includes(PREFIX_IMPRESSION)) {
        sessionImpressionsForAllWidgets =
          sessionImpressionsForAllWidgets + ~~sessionStorage.getItem(k);
      }
    }
  }

  // check for impressions.global.session
  if (sessionImpressionsForAllWidgets >= impressionConstraints.global.session) {
    return false;
  }

  // all widget multi-session total
  if (impressionConstraints.global.total > 0 || impressionConstraints.global.buffer > 0) {
    for (var j = 0; j < ~~localStorage.length; j++) {
      var l = localStorage.key(j);
      if (typeof l !== 'undefined' && l.includes(PREFIX_IMPRESSION)) {
        parts = read(l).split('|');
        totalImpressions = parseInt(parts[0], 10);
        impressionsForAllWidgets = impressionsForAllWidgets + totalImpressions;

        if (typeof parts[1] !== 'undefined') {
          lastImpressionTimeForAllWidgets = Math.max(parts[1], lastImpressionTimeForAllWidgets);
        }
      }
    }

    // check for impressions.global.buffer
    if (lastImpressionTimeForAllWidgets > 0) {
      if (impressionConstraints.global.buffer > 0 && (Math.abs(lastImpressionTimeForAllWidgets - now) / 1000 < impressionConstraints.global.buffer)) {
        return false;
      }
    }
  }

  // check for impressions.global.duration
  if (impressionConstraints.global.duration > 0) {
    since = read(sinceId);
    parts = since.split('|');
    if (parts[0] >= impressionConstraints.global.total) {
      return false;
    }
  }

  // check for impressions.global.total
  if (impressionsForAllWidgets >= impressionConstraints.global.total && typeof impressionConstraints.global.duration === 'undefined') {
    return false;
  }

  return true;
}
