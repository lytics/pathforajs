/** @module pathfora/display-conditions/entity-fields/replace-entity-fields */

// utils
import getObjectValue from '../../utils/objects/get-object-value';

/**
 * Evaluate all fields on the list provided and replace
 * any entity templates with values.
 *
 * @exports replaceEntityFields
 * @params {array} fields
 * @params {object} widget
 * @params {function} cb
 */
export default function replaceEntityFields (fields, widget, cb) {
  var found, i,
      regex = /\{{2}.*?\}{2}/g,
      pf = this,
      count = 0;

  var checker = function () {
    widget.valid = widget.valid && pf.entityFieldChecker(widget, fields[i], found);
    count++;

    if (count === fields.length) {
      cb();
    }
  };

  for (i = 0; i < fields.length; i++) {
    var fieldValue = getObjectValue(widget, fields[i]);

    if (typeof fieldValue === 'function') {
      fieldValue = String(fieldValue);
    }

    if (typeof fieldValue === 'string') {
      found = fieldValue.match(regex);

      if (found && found.length > 0) {
        pf.addCallback(checker);
      } else {
        count++;
      }
    } else {
      count++;
    }

    if (count === fields.length) {
      cb();
    }
  }
}
