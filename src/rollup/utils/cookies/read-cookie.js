/** @module pathfora/utils/cookie/read-cookie */

// dom
import document from '../../dom/document';

// utils
import escapeRegex from '../escape-regex';
import saveCookie from './save-cookie';
import deleteCookie from './delete-cookie';

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
    if (val === decodeURIComponent(val)) {
      deleteCookie(name);
      saveCookie(encodeURIComponent(name), encodeURIComponent(val));
    }

    return decodeURIComponent(val);
  }

  return null;
}
