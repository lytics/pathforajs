/** @module pathfora/utils/cookie/save-cookie */

import document from '../../dom/document';

/**
 * Set the value of a cookie
 *
 * @exports saveCookie
 * @params {string} name
 * @params {string} value
 * @params {object} expiration
 */
export default function saveCookie (name, value, expiration) {
  var expires;

  if (expiration) {
    expires = '; expires=' + expiration.toUTCString();
  } else {
    expires = '; expires=0';
  }

  document.cookie = [
    name,
    '=',
    value,
    expires,
    '; path = /'
  ].join('');
}
