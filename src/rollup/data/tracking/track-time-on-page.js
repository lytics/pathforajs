/** @module pathfora/data/tracking/track-time-on-page */

import { pathforaDataObject } from '../../globals/config';

/**
 * Record the amount of time the user has spent
 * on the current page
 *
 * @exports trackTimeOnPage
 */
export default function trackTimeOnPage () {
  setInterval(function () {
    pathforaDataObject.timeSpentOnPage += 1;
  }, 1000);
}
