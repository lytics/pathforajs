/** @module pathfora/display-conditions/url-contains/phrase-checker */

import compareQueries from './compare-queries';
import parseQuery from './parse-query';

import escapeURI from '../../utils/url/escape-uri';

export default function phraseChecker (phrase, url, simpleurl, queries) {
  var valid = false;

  // legacy match allows for an array of strings, check if we are legacy or current object approach
  switch (typeof phrase) {
  case 'string':
    if (url.indexOf(escapeURI(phrase.split('?')[0], { keepEscaped: true })) !== -1) {
      valid = compareQueries(queries, parseQuery(phrase), 'substring');
    }
    break;

  case 'object':
    if (phrase.match && phrase.value) {
      var phraseValue = escapeURI(phrase.value, { keepEscaped: true });

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
        if (url.split('?')[0].replace(/\/$/, '') === phraseValue.split('?')[0].replace(/\/$/, '')) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
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
        if (url.indexOf(phraseValue.split('?')[0]) !== -1) {
          valid = compareQueries(queries, parseQuery(phraseValue), phrase.match);
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
