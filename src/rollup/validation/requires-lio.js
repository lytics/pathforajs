/** @module pathfora/validation/requires-lio */

// global
import { ENTITY_FIELD_TEMPLATE_REGEX, ENTITY_FIELDS } from '../globals/config';

// utils
import getObjectValue from '../utils/objects/get-object-value';

/**
 * Determine if the settings of a given array
 * of the widgets provided require that
 * the lytics user entity be loaded before
 * proceeding with the initialization.
 *
 * @exports requiresLio
 * @params {object} widgets
 */
export default function requiresLio (widgets) {
  if (widgets.target || widgets.exclude) {
    return true;
  }

  var array = widgets;

  if (widgets.common) {
    array = widgets.common;
  }

  for (var i = 0; i < array.length; i++) {
    var widget = array[i];

    if (widget.recommend && Object.keys(widget.recommend).length !== 0) {
      return true;
    }

    for (var j = 0; j < ENTITY_FIELDS.length; j++) {
      var fieldValue = getObjectValue(widget.config, ENTITY_FIELDS[j]);

      // convert functions to a string
      if (typeof fieldValue === 'function') {
        fieldValue = fieldValue.toString();
      }

      if (typeof fieldValue === 'string') {
        if (ENTITY_FIELD_TEMPLATE_REGEX.test(fieldValue)) {
          return true;
        }
      }
    }
  }

  return false;
}
