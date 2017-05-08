/** @module core/track-time-on-page */

export default function trackTimeOnPage () {
  this.tickHandler = setInterval(function () {
    pathforaDataObject.timeSpentOnPage += 1;
  }, 1000);
};