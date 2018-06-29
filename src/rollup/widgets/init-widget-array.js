/** @module pathfora/widgets/initialize-widget-array */

// globals
import {
  widgetTracker,
  defaultProps,
  OPTIONS_PRIORITY_ORDERED
} from '../globals/config';

// utils
import updateObject from '../utils/objects/update-object';

// widgets
import preloadLio from './preload-lio';
import preloadRecommendation from './recommendations/preload-recommendation';

/**
 * Given an array of widgets, begin off the initialization
 * process for each
 *
 * @exports initializeWidgetArray
 * @params {array} array
 */
export default function initializeWidgetArray (array, options) {
  var pf = this;
  widgetTracker.prioritizedWidgets = [];

  var initWidget = function (widgetArray, index, initOptions) {
    if (index >= widgetArray.length) {
      return;
    }

    var widget = widgetArray[index],
        defaults = defaultProps[widget.type],
        globals = defaultProps.generic;

    updateObject(widget, globals);
    updateObject(widget, defaults);
    updateObject(widget, widget.config);

    if (widgetTracker.initializedWidgets.indexOf(widget.id) < 0) {
      widgetTracker.initializedWidgets.push(widget.id);
    } else {
      throw new Error('Cannot add two widgets with the same id');
    }

    // retain support for old "success" field
    if (widget.success) {
      if (!widget.formStates) {
        widget.formStates = {};
      }

      if (!widget.formStates.success) {
        widget.formStates.success = widget.success;
      }
    }

    preloadLio(widget, pf, function () {
      preloadRecommendation(widget, pf, function () {
        pf.initializeWidget(widget, initOptions);
        if (initOptions && initOptions.priority === OPTIONS_PRIORITY_ORDERED) {
          if (
            widgetTracker.prioritizedWidgets.length &&
            widgetTracker.prioritizedWidgets[0].id === widget.id
          ) {
            return;
          }

          initWidget(widgetArray, index + 1, initOptions);
        }
      });
    });

    if (!initOptions || initOptions.priority !== OPTIONS_PRIORITY_ORDERED) {
      initWidget(widgetArray, index + 1, initOptions);
    }
  };

  initWidget(array, 0, options);
}
