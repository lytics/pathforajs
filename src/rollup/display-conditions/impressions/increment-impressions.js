/** @module pathfora/display-conditions/impressions/increment-impressions */

// globals
import { PREFIX_IMPRESSION, PREFIX_TOTAL_IMPRESSIONS_SINCE } from '../../globals/config';

// utils
import read from '../../utils/persist/read';
import write from '../../utils/persist/write';

/**
 * Increment the impression count for a widget
 *
 * @exports incrementImpressions
 * @params {object} widget
 */
export default function incrementImpressions (widget) {
  var parts,
      totalImpressions,
      id = PREFIX_IMPRESSION + widget.id,
      sessionImpressions = ~~sessionStorage.getItem(id),
      total = read(id),
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
  write(id, Math.min(totalImpressions, 9998) + '|' + now, widget.expiration);

  // increment the "total since" values for modals with the impressions.global.duration config option
  for (var i = 0; i < ~~localStorage.length; i++) {
    var k = localStorage.key(i);
    if (typeof k !== 'undefined' && k.includes(PREFIX_TOTAL_IMPRESSIONS_SINCE)) {
      parts = read(k).split('|');
      totalImpressions = parseInt(parts[0], 10) + 1;
      write(k, totalImpressions + '|' + parts[1], widget.expiration);
    }
  }
}
