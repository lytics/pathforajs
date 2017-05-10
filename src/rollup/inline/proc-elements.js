/** @module pathfora/inline/proc-elements */

export default function procElements () {
  var attrs = ['data-pftrigger', 'data-pfrecommend'],
      inline = this,
      count = 0;

  var cb = function (elements) {
    count++;
    // After we have processed all elements, proc defaults
    if (count === Object.keys(elements).length) {
      inline.setDefaultRecommend(elements);
    }
  };

  attrs.forEach(function (attr) {
    var elements = inline.prepElements(attr);

    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {

        switch (attr) {
        // CASE: Segment triggered elements
        case 'data-pftrigger':
          inline.procTriggerElements(elements[key], key);
          break;

        // CASE: Content recommendation elements
        case 'data-pfrecommend':
          if (typeof inline.parent.acctid !== 'undefined' && inline.parent.acctid === '') {
            throw new Error('Could not get account id from Lytics Javascript tag.');
          }

          inline.procRecommendElements(elements[key], key, function () {
            cb(elements);
          });
          break;
        }
      }
    }
  });
}
