/** @module pathfora/display-conditions/pageviews/init-pageviews */

// globals
import { PF_PAGEVIEWS } from '../../globals/config';

// utils
import read from '../../utils/persist/read';
import write from '../../utils/persist/write';

/**
 * Track and update the number of pageviews
 *
 * @exports initializePageViews
 */
export default function initializePageViews () {
  var cookie = read(PF_PAGEVIEWS);

  write(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1);
}
