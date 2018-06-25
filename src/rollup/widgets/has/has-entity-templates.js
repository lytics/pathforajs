// globals
import {
  ENTITY_FIELDS,
  ENTITY_FIELD_TEMPLATE_REGEX
} from '../../globals/config';

// utils
import getObjectValue from '../../utils/objects/get-object-value';

export default function hasEntityTemplates (widget) {
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

  return false;
}
