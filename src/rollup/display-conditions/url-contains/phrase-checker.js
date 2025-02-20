/** @module pathfora/display-conditions/url-contains/phrase-checker */

// utils
import escapeURI from '../../utils/url/escape-uri';

// display conditions
import compareQueries from './compare-queries';
import parseQuery from './parse-query';

/**
 * Evaluate if the current URL matches a single urlContains
 * rule provided
 *
 * @exports phraseChecker
 * @params {object} phrase
 * @params {string} url
 * @params {string} simpleurl
 * @params {object} queries
 * @returns {boolean}
 */
export default function phraseChecker(phrase, url, simpleurl, queries) {
  var valid = false;

  // legacy match allows for an array of strings, check if we are legacy or current object approach
  switch (typeof phrase) {
    case 'string':
      if (
        url.indexOf(escapeURI(phrase.split('?')[0], { keepEscaped: true })) !==
        -1
      ) {
        valid = compareQueries(queries, parseQuery(phrase), 'substring');
      }
      break;

    case 'object':
      if (phrase.match && phrase.value) {
        var phraseValue = escapeURI(phrase.value, { keepEscaped: true });
        var query = parseQuery(phraseValue);

        switch (phrase.match) {
          // simple match
          case 'simple':
            if (simpleurl.slice(-1) === '/') {
              simpleurl = simpleurl.slice(0, -1);
            }

            if (phrase.value.slice(-1) === '/') {
              phrase.value = phrase.value.slice(0, -1);
            }

            if (simpleurl === phrase.value) {
              valid = true;
            }
            break;

          // exact match
          case 'exact':
            if (
              Object.keys(query).length > 0 &&
              url.split('?')[0].replace(/\/$/, '') ===
                phraseValue.split('?')[0].replace(/\/$/, '')
            ) {
              valid = compareQueries(queries, query, phrase.match);
            } else {
              valid = url.replace(/\/$/, '') === phraseValue.replace(/\/$/, '');
            }
            break;

          // regex
          case 'regex':
            var re = new RegExp(phrase.value);

            if (re.test(url)) {
              valid = true;
            }
            break;

          // string match (default)
          default:
            if (
              Object.keys(query).length > 0 &&
              url.indexOf(phraseValue.split('?')[0]) !== -1
            ) {
              valid = compareQueries(queries, query, phrase.match);
            } else {
              valid = url.indexOf(phraseValue) !== -1;
            }
            break;
        }
      } else {
        console.log('invalid display conditions');
      }
      break;

    default:
      console.log('invalid display conditions');
      break;
  }

  return valid;
}
