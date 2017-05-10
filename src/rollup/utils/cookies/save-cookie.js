/** @module utils/save-cookie */

import document from '../../dom/document'

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
};