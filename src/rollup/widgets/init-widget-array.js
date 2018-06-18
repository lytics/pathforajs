/** @module pathfora/widgets/initialize-widget-array */

// globals
import {
  PREFIX_UNLOCK,
  widgetTracker,
  defaultProps,
  callbackTypes
} from '../globals/config';

// utils
import readCookie from '../utils/cookies/read-cookie';
import updateObject from '../utils/objects/update-object';

/**
 * Given an array of widgets, begin off the initialization
 * process for each
 *
 * @exports initializeWidgetArray
 * @params {array} array
 */
export default function initializeWidgetArray (array, options) {
  var pf = this;

  for (var i = 0; i < array.length; i++) {
    var widget = array[i];

    if (!widget || !widget.config) {
      continue;
    }

    var widgetOnInitCallback = widget.config.onInit,
        defaults = defaultProps[widget.type],
        globals = defaultProps.generic;

    if (
      (widget.type === 'sitegate' &&
        readCookie(PREFIX_UNLOCK + widget.id) === 'true') ||
      widget.hiddenViaABTests === true
    ) {
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

    if (
      (widget.recommend && Object.keys(widget.recommend).length !== 0) ||
      (widget.content && widget.content.length !== 0)
    ) {
      pf.initializeRecommendationWidget(widget, options);
    } else {
      pf.initializeWidget(widget, options);
    }

    // NOTE onInit feels better here
    if (typeof widgetOnInitCallback === 'function') {
      widgetOnInitCallback(callbackTypes.INIT, {
        config: widget
      });
    }

    if (options && options.priority === 'ordered') {
      if (
        widgetTracker.prioritizedWidgets.length &&
        widgetTracker.prioritizedWidgets[0].id === widget.id
      ) {
        break;
      }
    }

    console.log('in array', widget, widgetTracker.prioritizedWidgets);
  }
}
