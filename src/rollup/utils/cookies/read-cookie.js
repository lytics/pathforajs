/** @module pathfora/utils/cookie/read-cookie */

// dom
import document from '../../dom/document';

// utils
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
