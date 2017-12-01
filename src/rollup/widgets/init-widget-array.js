/** @module pathfora/widgets/initialize-widget-array */

// globals
import { PREFIX_UNLOCK, widgetTracker, defaultProps, callbackTypes } from '../globals/config';

// dom
import window from '../dom/window';

// utils
import readCookie from '../utils/cookies/read-cookie';
import updateObject from '../utils/objects/update-object';

// recommendations
import recommendContent from '../recommendations/recommend-content';

/**
 * Given an array of widgets, begin off the initialization
 * process for each
 *
 * @exports initializeWidgetArray
 * @params {array} array
 */
export default function initializeWidgetArray (array) {
  var pf = this;

  var recContent = function (w, params) {
    pf.addCallback(function () {
      if (typeof pf.acctid !== 'undefined' && pf.acctid === '') {
        if (window.lio && window.lio.account) {
          pf.acctid = window.lio.account.id;
        } else {
          throw new Error('Could not get account id from Lytics Javascript tag.');
        }
      }

      recommendContent(pf.acctid, params, w.id, function (resp) {
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

        pf.initializeWidget(w);
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

    if (widgetTracker.initializedWidgets.indexOf(widget.id) < 0) {
      widgetTracker.initializedWidgets.push(widget.id);
    } else {
      throw new Error('Cannot add two widgets with the same id');
    }

    updateObject(widget, globals);
    updateObject(widget, defaults);
    updateObject(widget, widget.config);

    // retain support for old "success" field
    if (widget.success) {
      if (!widget.formStates) {
        widget.formStates = {};
      }

      if (!widget.formStates.success) {
        widget.formStates.success = widget.success;
      }
    }

    if (widget.showSocialLogin) {
      if (widget.showForm === false) {
        throw new Error('Social login requires a form on the widget');
      }
    }

    if (widget.type === 'message' && (widget.recommend && Object.keys(widget.recommend).length !== 0) || (widget.content && widget.content.length !== 0)) {
      if (widget.layout !== 'slideout' && widget.layout !== 'modal' && widget.layout !== 'inline') {
        throw new Error('Unsupported layout for content recommendation');
      }

      if (widget.content && widget.content[0] && !widget.content[0].default) {
        throw new Error('Cannot define recommended content unless it is a default');
      }

      var params = widget.recommend;

      if (params && params.collection) {
        params.contentsegment = widget.recommend.collection;
        delete params.collection;
      }

      recContent(widget, params);

    } else {
      pf.initializeWidget(widget);
    }

    // NOTE onInit feels better here
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: widget
      });
    }
  }
}
