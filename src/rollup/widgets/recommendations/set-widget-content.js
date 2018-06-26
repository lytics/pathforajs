/** @module pathfora/widgets/recommendation/set-widget-recommendation */

import recommendContent from '../../recommendations/recommend-content';

/**
 * Make the call to get the recommendations then
 * handle assigning it to the widget.
 *
 * @exports setWidgetContent
 * @params {object} accountId
 * @params {object} widget
 * @params {function} cb
 */

export default function setWidgetContent (accountId, widget, cb) {
  var params = widget.recommend;

  if (params && params.collection) {
    params.contentsegment = widget.recommend.collection;
    delete params.collection;
  }

  recommendContent(accountId, params, widget.id, function (resp) {
    // if we get a response from the recommend api put it as the first
    // element in the content object this replaces any default content
    if (resp[0]) {
      var content = resp[0];
      widget.content = [
        {
          title: content.title,
          description: content.description,
          url: content.url,
          image: content.primary_image,
          date: content.created,
          author: content.author
        }
      ];
    }

    // if we didn't get a valid response from the api, we check if a default
    // exists and use that as our content piece instead
    if (!widget.content) {
      throw new Error('Could not get recommendation and no default defined');
    }

    cb();
  });
}
