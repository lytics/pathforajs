/** @module pathfora/validation/requires-lio */

// globals
import { ENTITY_FIELDS, ENTITY_FIELD_TEMPLATE_REGEX } from '../globals/config';

// utils
import getObjectValue from '../utils/objects/get-object-value';

/**
 * Check if the
 *
 * @exports requiresLio
 * @params {widgets} object
 */
export default function requiresLio (widgets) {
  if (widgets.target || widgets.inverse || widgets.exclude) {
    return true;
  }

  if (Array.isArray(widgets)) {
    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];

      for (var j = 0; j < ENTITY_FIELDS.length; j++) {
        var fieldValue = getObjectValue(widget, ENTITY_FIELDS[j]);

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
  }

  return false;
}
