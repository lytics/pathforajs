/** @module pathfora/inline/proc-recommend-elements */

import recommendContent from '../recommendations/recommend-content';

/**
 * Make recommendation and fill in the appropriate inline
 * recommendation elements
 *
 * @exports procRecommendElements
 * @params {object} blocks
 * @params {string} rec
 * @params {function} cb
 */
export default function procRecommendElements (blocks, rec, shuffle, cb) {
  var inline = this;

  if (rec !== 'default') {
    // call the recommendation API using the url pattern urlPattern as a filter
    var params = {
      contentsegment: rec
    };

    if (shuffle) {
      params.shuffle = shuffle;
    }

    recommendContent(inline.parent.acctid, params, rec, function (resp) {
      var idx = 0;
      for (var block in blocks) {
        if (blocks.hasOwnProperty(block) && block !== 'shuffle') {
          var elems = blocks[block];

          // loop through the results as we loop
          // through each element with a common liorecommend value
          if (resp[idx]) {
            var content = resp[idx];

            if (elems.title) {
              elems.title.innerHTML = content.title;
            }

            // if attribute is on image element
            if (elems.image) {
              if (typeof elems.image.src !== 'undefined') {
                elems.image.src = content.primary_image;
              // if attribute is on container element, set the background
              } else {
                elems.image.style.backgroundImage = 'url("' + content.primary_image + '")';
              }
            }

            // set the description
            if (elems.description) {
              elems.description.innerHTML = content.description;
            }

            // if attribute is on an a (link) element
            if (elems.url) {
              if (typeof elems.url.href !== 'undefined') {
                elems.url.href = content.url;
              // if attribute is on container element
              } else {
                elems.url.innerHTML = content.url;
              }
            }

            // set the date published
            if (elems.published && content.created) {
              var published = new Date(content.created);
              elems.published.innerHTML = published.toLocaleDateString(inline.parent.locale, inline.parent.dateOptions);
            }

            // set the author
            if (elems.author) {
              elems.author.innerHTML = content.author;
            }

            elems.elem.removeAttribute('data-pfrecommend');
            elems.elem.setAttribute('data-pfmodified', 'true');
            inline.preppedElements[block] = elems;
          } else {
            break;
          }
          idx++;
        }
      }
      cb();
    });
  } else {
    for (var block in blocks) {
      if (blocks.hasOwnProperty(block)) {
        inline.defaultElements[block] = blocks[block];
      }
    }
    cb();
  }
}
