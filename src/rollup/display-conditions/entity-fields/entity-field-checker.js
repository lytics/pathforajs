/** @module pathfora/display-conditions/entity-fields/entity-field-checker */

// utils
import getObjectValue from '../../utils/objects/get-object-value';

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
export default function entityFieldChecker (fields, widget, cb) {
  var found, i,
      regex = /\{{2}.*?\}{2}/g,
      pf = this,
      count = 0;

  // call the replace method in a jstag callback
  var replace = function (w, fieldName, f) {
    pf.addCallback(function () {
      w.valid = w.valid && pf.replaceEntityField(w, fieldName, f);
      count++;

      if (count === fields.length) {
        cb();
      }
    });
  };

  for (i = 0; i < fields.length; i++) {
    var fieldValue = getObjectValue(widget, fields[i]);

    // convert functions to a string
    if (typeof fieldValue === 'function') {
      fieldValue = fieldValue.toString();
    }

    if (typeof fieldValue === 'string') {
      found = fieldValue.match(regex);

      if (found && found.length > 0) {
        replace(widget, fields[i], found);
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
