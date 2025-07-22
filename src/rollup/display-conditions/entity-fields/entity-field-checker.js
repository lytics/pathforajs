/** @module pathfora/display-conditions/entity-fields/entity-field-checker */

// globals
import {
  ENTITY_FIELD_TEMPLATE_REGEX,
  ENTITY_FIELDS,
  DEPENDENT_DATA_ENTITY_FIELD,
  widgetTracker
} from '../../globals/config';

// utils
import getObjectValue from '../../utils/objects/get-object-value';

// display conditions
import replaceEntityField from './replace-entity-field';

/**
 * Evaluate all fields on the list provided and check
 * if there are any entity templates that need to be
 * replaced.
 *
 * @exports entityFieldChecker
 * @params {array} fields
 * @params {object} widget
 * @params {function} cb
 */
export default function entityFieldChecker (widget, customData) {
  var found,
      valid = true,
      dependentData = [];

  for (var i = 0; i < ENTITY_FIELDS.length; i++) {
    var regex = new RegExp(ENTITY_FIELD_TEMPLATE_REGEX, 'g'),
        fieldValue = getObjectValue(widget, ENTITY_FIELDS[i]);

    // convert functions to a string
    if (typeof fieldValue === 'function') {
      fieldValue = fieldValue.toString();
    }

    if (typeof fieldValue === 'string') {
      found = fieldValue.match(regex);

      if (found && found.length > 0) {
        for (var j = 0; j < found.length; j++) {
          if (!dependentData.includes(found[j])) {
            var foundval = found[j].slice(2).slice(0, -2),
                parts = foundval.split('|');

            dependentData.push(parts[0].trim());
          }
        }


        valid =
          valid &&
          replaceEntityField(widget, ENTITY_FIELDS[i], found, customData);
      }
    }
  }

  if (dependentData.length > 0) {
    if (!widgetTracker.dependentDataWidgets[widget.id]) {
      widgetTracker.dependentDataWidgets[widget.id] = {};
    }
    widgetTracker.dependentDataWidgets[widget.id][DEPENDENT_DATA_ENTITY_FIELD] = dependentData;
  }

  return valid;
}
