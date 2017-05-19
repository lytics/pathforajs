/** @module pathfora/utils/cookie/read-cookie */

import document from '../../dom/document';
import escapeRegex from '../escape-regex';

/**
 * Get the value of a cookie
 *
 * @exports readCookie
 * @params {string} name
 * @returns {string}
 */
export default function readCookie (name) {
  var cookies = document.cookie,
      findCookieRegexp = cookies.match('(^|;)\\s*' + escapeRegex(name) + '\\s*=\\s*([^;]+)');

  return findCookieRegexp ? findCookieRegexp.pop() : null;
}
