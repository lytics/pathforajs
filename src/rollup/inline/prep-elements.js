/** @module pathfora/inline/prep-elements */

import document from '../dom/document';

/**
 * Build a list of all elements to be personalized
 *
 * @exports prepElements
 * @params {string} attr
 * @returns {object} dataElements
 */
export default function prepElements (attr) {
  var dataElements = {},
      elements = document.querySelectorAll('[' + attr + ']');

  this.elements = this.elements.concat(elements);

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute(attr) !== null) {
      var theElement = elements[i];

      switch (attr) {
      // CASE: Segment triggered elements
      case 'data-pftrigger':
        var group = theElement.getAttribute('data-pfgroup');

        if (!group) {
          group = 'default';
        }

        if (!dataElements[group]) {
          dataElements[group] = [];
        }

        dataElements[group].push({
          elem: theElement,
          displayType: theElement.style.display,
          group: group,
          trigger: theElement.getAttribute('data-pftrigger')
        });
        break;

      // CASE: Content recommendation elements
      case 'data-pfrecommend':
        var recommend = theElement.getAttribute('data-pfrecommend'),
            block = theElement.getAttribute('data-pfblock'),
            shuffle = false;

        if (!block) {
          block = 'default';
        }

        if (!recommend) {
          recommend = 'default';
        }

        if (!dataElements[recommend]) {
          dataElements[recommend] = {};
        }

        if (theElement.hasAttribute('data-pfshuffle')) {
          shuffle = theElement.getAttribute('data-pfshuffle') === 'true';
        }

        if (!dataElements[recommend].shuffle) {
          dataElements[recommend].shuffle = shuffle;
        }

        dataElements[recommend][block] = {
          elem: theElement,
          displayType: theElement.style.display,
          block: block,
          recommend: recommend,
          shuffle: shuffle,
          title: theElement.querySelector('[data-pftype="title"]'),
          image: theElement.querySelector('[data-pftype="image"]'),
          description: theElement.querySelector('[data-pftype="description"]'),
          url: theElement.querySelector('[data-pftype="url"]'),
          published: theElement.querySelector('[data-pftype="published"]'),
          author: theElement.querySelector('[data-pftype="author"]')
        };
        break;
      }
    }
  }
  return dataElements;
}
