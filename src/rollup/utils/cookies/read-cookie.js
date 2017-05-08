/** @module utils/read-cookie */

export default function readCookie (name) {
  var cookies = document.cookie,
      findCookieRegexp = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');

  return findCookieRegexp ? findCookieRegexp.pop() : null;
}