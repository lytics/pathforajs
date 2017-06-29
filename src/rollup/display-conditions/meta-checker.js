/** @module pathfora/display-conditions/meta-checker */

// utils
import document from '../dom/document';

/**
 * Check if the current page contains the meta
 * tag and value provided
 *
 * @exports metaChecker
 * @params {array} phrases
 * @returns {boolean}
 */
export default function metaChecker (phrases) {
  var meta = document.querySelectorAll('meta');

  for (var j = 0; j < phrases.length; j++) {
    var rule = phrases[j],
        phraseValid = false;

    for (var i = 0; i < meta.length; i++) {
      for (var key in rule) {
        if (rule.hasOwnProperty(key)) {
          var val = meta[i].getAttribute(key);

          if (!val || val !== rule[key]) {
            phraseValid = false;
            break;
          } else {
            phraseValid = true;
          }
        }
      }

      if (phraseValid) {
        break;
      }
    }

    if (phraseValid) {
      return true;
    }
  }

  return false;
}
