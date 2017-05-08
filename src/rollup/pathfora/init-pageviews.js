 /** @module pathfora/init-pageviews */

export default function initializePageViews () {
  var cookie = utils.readCookie(PF_PAGEVIEWS),
      date = new Date();
  date.setDate(date.getDate() + 365);
  utils.saveCookie(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1, date);
};
