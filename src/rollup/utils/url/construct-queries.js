/** @module pafthroa/utils/url/construct-queries */

/**
 * Construct the params string for a url from an
 * object containing key/values
 *
 * @exports constructQueries
 * @params {object} params
 * @returns {string}
 */
export default function constructQueries (params) {
  var count = 0,
      queries = [];

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      if (count !== 0) {
        queries.push('&');
      } else {
        queries.push('?');
      }

      if (params[key] instanceof Object) {
        // multiple params []string (topics or rollups)
        for (var i in params[key]) {
          if (params[key].hasOwnProperty(i)) {
            if (i < Object.keys(params[key]).length && i > 0) {
              queries.push('&');
            }

            queries.push(key + '[]=' + params[key][i]);
          }
        }

      // single param
      } else {
        queries.push(key + '=' + params[key]);
      }

      count++;
    }
  }

  return queries.join('');
}
