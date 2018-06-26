/** @module pathfora/widgets/has/has-entity-templates */

// globals
import {
  ENTITY_FIELDS,
  ENTITY_FIELD_TEMPLATE_REGEX
} from '../../globals/config';

// utils
import getObjectValue from '../../utils/objects/get-object-value';

/**
 * Check if the widget has entity field templates
 *
 * @exports hasEntityTemplates
 * @params {object} widget
 * @returns {bool} hasEntityTemplates
 */
export default function hasEntityTemplates (widget) {
  for (var j = 0; j < ENTITY_FIELDS.length; j++) {
    var regex = new RegExp(ENTITY_FIELD_TEMPLATE_REGEX, 'g'),
        fieldValue = getObjectValue(widget, ENTITY_FIELDS[j]);

    // convert functions to a string
    if (typeof fieldValue === 'function') {
      fieldValue = fieldValue.toString();
    }

    if (typeof fieldValue === 'string') {
      if (regex.test(fieldValue)) {
        return true;
      }
    }
  }

  return false;
}
