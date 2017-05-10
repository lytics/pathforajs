 /** @module pathfora/display-conditions/pageviews/init-pageviews */

import { PF_PAGEVIEWS } from '../../globals/config';

import readCookie from '../../utils/cookies/read-cookie';
import saveCookie from '../../utils/cookies/read-cookie';

export default function initializePageViews () {
  var cookie = readCookie(PF_PAGEVIEWS),
      date = new Date();
  date.setDate(date.getDate() + 365);
  saveCookie(PF_PAGEVIEWS, Math.min(~~cookie, 9998) + 1, date);
}
