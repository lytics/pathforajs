/** @module pathfora/display-conditions/url-contains/compare-queries */

/**
 * Check if urls contain matching query params
 *
 * @exports compareQueries
 * @params {object} query
 * @params {object} matchQuery
 * @params {string} rule
 * @returns {boolean}
 */
export default function compareQueries (query, matchQuery, rule) {
  switch (rule) {
  case 'exact':
    if (Object.keys(matchQuery).length !== Object.keys(query).length) {
      return false;
    }
    break;

  default:
    break;
  }

  for (var key in matchQuery) {
    if (matchQuery.hasOwnProperty(key) && matchQuery[key] !== query[key]) {
      return false;
    }
  }

  return true;
}
