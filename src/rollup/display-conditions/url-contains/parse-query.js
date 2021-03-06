/** @module pathfora/display-conditions/url-contains/parse-query */

import escapeURI from '../../utils/url/escape-uri';

/**
 * Convert key/value queries from a URL into an object
 *
 * @exports parseQuery
 * @params {string} url
 * @returns {object} query
 */
export default function parseQuery (url) {
  var query = {},
      pieces = escapeURI(url, { keepEscaped: true }).split('?');

  if (pieces.length > 1) {
    pieces = pieces[1].split('&');

    for (var i = 0; i < pieces.length; i++) {
      var pair = pieces[i].split('=');

      if (pair.length > 1) {
        // NOTE We should not account for the preview id
        if (pair[0] !== 'lytics_variation_preview_id') {
          query[pair[0]] = pair[1];
        }
      }
    }
  }

  return query;
}
