/** @module pathfora/display-conditions/url-contains/url-checker */

// utils
import escapeURI from '../../utils/url/escape-uri';

// display conditions
import parseQuery from './parse-query';
import phraseChecker from './phrase-checker';

/**
 * Evaluate if the current URL matches the rules defined
 * by the urlContains display condition
 *
 * @exports urlChecker
 * @params {array} phrases
 * @returns {boolean}
 */
export default function urlChecker (phrases) {
  var url = escapeURI(window.location.href, { keepEscaped: true }),
      simpleurl = window.location.hostname + window.location.pathname,
      queries = parseQuery(url),
      valid = false,
      excludeValid = false,
      matchCt = 0,
      excludeCt = 0;

  if (!(phrases instanceof Array)) {
    phrases = Object.keys(phrases).map(function (key) {
      return phrases[key];
    });
  }

  // array of urlContains params is an "OR" list, so if any are true evaluate valid to true
  if (phrases.indexOf('*') === -1) {
    phrases.forEach(function (phrase) {
      if (phrase.exclude) {
        excludeValid = phraseChecker(phrase, url, simpleurl, queries) || excludeValid;
        excludeCt++;
      } else {
        valid = phraseChecker(phrase, url, simpleurl, queries) || valid;
        matchCt++;
      }
    });
  } else {
    valid = true;
  }

  if (matchCt === 0) {
    return !excludeValid;
  }

  if (excludeCt === 0) {
    return valid;
  }

  return valid && !excludeValid;
}
