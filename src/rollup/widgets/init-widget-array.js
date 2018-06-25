/** @module pathfora/widgets/initialize-widget-array */

// globals
import { widgetTracker, defaultProps } from '../globals/config';

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

  var initWidget = function (a, index) {
    if (index >= a.length) {
      return;
    }

    var widget = a[index],
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
        pf.initializeWidget(widget, options);

        if (options && options.priority === 'ordered') {
          if (
            widgetTracker.prioritizedWidgets.length &&
            widgetTracker.prioritizedWidgets[0].id === widget.id
          ) {
            return;
          }

          initWidget(a, index + 1);
        }
      });
    });

    if (!options || options.priority !== 'ordered') {
      initWidget(a, index + 1);
    }

  };

  initWidget(array, 0);
}
