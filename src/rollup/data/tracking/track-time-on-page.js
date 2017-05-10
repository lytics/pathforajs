/** @module core/track-time-on-page */

import { pathforaDataObject } from '../../globals/config'

export default function trackTimeOnPage () {
  setInterval(function () {
    pathforaDataObject.timeSpentOnPage += 1;
  }, 1000);
};