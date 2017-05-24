/** @module pathfora/utils/url/escape-uri */

/**
 * Escape URIs optionally without double-encoding
 *
 * @exports escapeURI
 * @params {string} text
 * @returns {object} options
 * @returns {string} uri
 */
export default function escapeURI (text, options) {
  // NOTE This was ported from various bits of C++ code from Chromium
  options || (options = {});

  var length = text.length,
      escaped = [],
      usePlus = options.usePlus || false,
      keepEscaped = options.keepEscaped || false;

  function isHexDigit (c) {
    return /[0-9A-Fa-f]/.test(c);
  }

  function toHexDigit (i) {
    return '0123456789ABCDEF'[i];
  }

  function containsChar (charMap, charCode) {
    return (charMap[charCode >> 5] & (1 << (charCode & 31))) !== 0;
  }

  function isURISeparator (c) {
    return ['#', ':', ';', '/', '?', '$', '&', '+', ',', '@', '='].indexOf(c) !== -1;
  }

  function shouldEscape (charText) {
    return !isURISeparator(charText) && containsChar([
      0xffffffff, 0xf80008fd, 0x78000001, 0xb8000001,
      0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff
    ], charText.charCodeAt(0));
  }

  for (var index = 0; index < length; index++) {
    var charText = text[index],
        charCode = text.charCodeAt(index);

    if (usePlus && charText === ' ') {
      escaped.push('+');
    } else if (keepEscaped && charText === '%' && length >= index + 2 &&
        isHexDigit(text[index + 1]) &&
        isHexDigit(text[index + 2])) {
      escaped.push('%');
    } else if (shouldEscape(charText)) {
      escaped.push('%',
        toHexDigit(charCode >> 4),
        toHexDigit(charCode & 0xf));
    } else {
      escaped.push(charText);
    }
  }

  return escaped.join('');
}
