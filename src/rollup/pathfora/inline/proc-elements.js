/** @module pathfora/inline/proc-elements */

import procRecommendElements from './proc-recommend-elements'
import setDefaultRecommend from './set-default-recommend'
import prepElements from './prep-elements'
import procTriggerElements from './proc-trigger-elements'


export default function procElements () {
  var attrs = ['data-pftrigger', 'data-pfrecommend'],
      inline = this,
      count = 0;

  var cb = function (elements) {
    count++;
    // After we have processed all elements, proc defaults
    if (count === Object.keys(elements).length) {
      setDefaultRecommend(elements);
    }
  };

  attrs.forEach(function (attr) {
    var elements = prepElements(attr);

    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {

        switch (attr) {
        // CASE: Segment triggered elements
        case 'data-pftrigger':
          procTriggerElements(elements[key], key);
          break;

        // CASE: Content recommendation elements
        case 'data-pfrecommend':
          if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
            throw new Error('Could not get account id from Lytics Javascript tag.');
          }

          procRecommendElements(elements[key], key, function () {
            cb(elements);
          });
          break;
        }
      }
    }
  });
};