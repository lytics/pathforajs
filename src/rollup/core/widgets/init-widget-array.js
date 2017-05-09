/** @module core/initialize-widget-array */

import registerDelayedWidget from '../displayConditions/delay/register-delayed-widget'
import initializeWidget from './init-widget'
import readCookie from '../../utils/cookies/read-cookie'
import updateObject from '../../utils/update-object'
import { PREFIX_UNLOCK } from '../../config/config'
import recommendContent from '../../api/recommend/recommend-content'
import addCallback from '../../pathfora/add-callback'
import { callbackTypes } from '../../config/callbacks'
import { defaultProps } from '../../config/default-props'


export default function initializeWidgetArray (array) {
  var displayWidget = function (w) {
    if (w.displayConditions.showDelay) {
      registerDelayedWidget(w);
    } else {
      initializeWidget(w);
    }
  };

  var recContent = function (w, params) {
    addCallback(function () {
      if (typeof pathfora.acctid !== 'undefined' && pathfora.acctid === '') {
        if (context.lio && context.lio.account) {
          pathfora.acctid = context.lio.account.id;
        } else {
          throw new Error('Could not get account id from Lytics Javascript tag.');
        }
      }

      recommendContent(pathfora.acctid, params, w.id, function (resp) {
        // if we get a response from the recommend api put it as the first
        // element in the content object this replaces any default content
        if (resp[0]) {
          var content = resp[0];
          w.content = [
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
        if (!w.content) {
          throw new Error('Could not get recommendation and no default defined');
        }

        displayWidget(w);
      });
    });
  };

  for (var i = 0; i < array.length; i++) {
    var widget = array[i];

    if (!widget || !widget.config) {
      continue;
    }

    var widgetOnInitCallback = widget.config.onInit,
        defaults = defaultProps[widget.type],
        globals = defaultProps.generic;

    if (widget.type === 'sitegate' && readCookie(PREFIX_UNLOCK + widget.id) === 'true' || widget.hiddenViaABTests === true) {
      continue;
    }

    if (this.initializedWidgets.indexOf(widget.id) < 0) {
      this.initializedWidgets.push(widget.id);
    } else {
      throw new Error('Cannot add two widgets with the same id');
    }

    updateObject(widget, globals);
    updateObject(widget, defaults);
    updateObject(widget, widget.config);

    if (widget.type === 'message' && (widget.recommend && Object.keys(widget.recommend).length !== 0) || (widget.content && widget.content.length !== 0)) {
      if (widget.layout !== 'slideout' && widget.layout !== 'modal' && widget.layout !== 'inline') {
        throw new Error('Unsupported layout for content recommendation');
      }

      if (widget.content && widget.content[0] && !widget.content[0].default) {
        throw new Error('Cannot define recommended content unless it is a default');
      }

      var params = widget.recommend;

      if (widget.recommend.collection) {
        params.contentsegment = widget.recommend.collection;
        delete params.collection;
      }

      recContent(widget, params);

    } else {
      displayWidget(widget);
    }

    // NOTE onInit feels better here
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: widget
      });
    }
  }
};