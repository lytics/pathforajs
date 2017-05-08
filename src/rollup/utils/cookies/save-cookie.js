/** @module utils/save-cookie */

export default function saveCookie (name, value, expiration) {
  var expires;

  if (expiration) {
    expires = '; expires=' + expiration.toUTCString();
  } else {
    expires = '; expires=0';
  }

  context.document.cookie = [
    name,
    '=',
    value,
    expires,
    '; path = /'
  ].join('');
};