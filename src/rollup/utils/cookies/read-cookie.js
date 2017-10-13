/** @module pathfora/utils/cookie/read-cookie */

// dom
import document from '../../dom/document';

// utils
import escapeRegex from '../escape-regex';
import saveCookie from './save-cookie';
import deleteCookie from './delete-cookie';
import isNotEncoded from '../is-not-encoded';
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
  if (!findCookieRegexp) {
    findCookieRegexp = cookies.match('(^|;)\\s*' + escapeRegex(name) + '\\s*=\\s*([^;]+)');
  } else {
    var val = findCookieRegexp.pop();

    // update any legacy cookies that haven't been encoded
    if (isNotEncoded(val)) {
      deleteCookie(name);
      saveCookie(name, val);
    }

    return decodeSafe(val);
  }

  return null;
}
