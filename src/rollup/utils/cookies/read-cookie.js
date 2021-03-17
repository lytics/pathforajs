/** @module pathfora/utils/cookie/read-cookie */

// dom
import document from '../../dom/document';

// utils
import escapeRegex from '../escape-regex';
import decodeSafe from '../decode-safe';

/**
 * Get the value of a cookie
 *
 * @exports readCookie
 * @params {string} name
 * @returns {string}
 */
export default function readCookie (name) {
  var cookies = document.cookie,
      findCookieRegexp = cookies.match('(^|;)\\s*' + encodeURIComponent(escapeRegex(name)) + '\\s*=\\s*([^;]+)');

  // legacy - check for cookie names that haven't been escaped
  if (findCookieRegexp == null) {
    findCookieRegexp = cookies.match('(^|;)\\s*' + escapeRegex(name) + '\\s*=\\s*([^;]+)');
  }

  if (findCookieRegexp != null) {
    var val = findCookieRegexp.pop();

    return decodeSafe(val);
  }

  return null;
}
