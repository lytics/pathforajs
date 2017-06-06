/** @module pathfora/display-conditions/entity-field-checker */

// dom
import window from '../../dom/window';

// utils
import setObjectValue from '../../utils/objects/set-object-value';
import getObjectValue from '../../utils/objects/get-object-value';

/**
 * Fill in the data for a entity field template in
 * a widgets text fields
 *
 * @exports entityFieldChecker
 * @params {object} widget
 * @params {string} fieldName
 * @params {array} found
 * @returns {boolean}
 */
export default function entityFieldChecker (widget, fieldName, found) {
  if (!found || !found.length) {
    return true;
  }

  var currentVal = getObjectValue(widget, fieldName),
      isFn = false,
      fnParams;

  // console.log(currentVal);

  if (typeof currentVal === 'function') {
    var fn = currentVal.toString();
    currentVal = fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}'));
    fnParams = fn.match(/(function.+\()(.+(?=\)))(.+$)/);
    isFn = true;
  }

  // for each template found...
  for (var f = 0; f < found.length; f++) {
    // parse the field name
    var dataval = found[f].slice(2).slice(0, -2),
        parts = dataval.split('|'),
        def = '';

    // get the default (fallback) value
    if (parts.length > 1) {
      def = parts[1].trim();
    }

    // check for subfields if the value is an object
    var split = parts[0].trim().split('.');

    dataval = window.lio.data;
    var s;

    for (s = 0; s < split.length; s++) {
      if (typeof dataval !== 'undefined') {
        dataval = dataval[split[s]];
      }
    }

    // if we couldn't find the data in question on the lytics jstag, check pathfora.customData
    if (typeof dataval === 'undefined') {
      dataval = this.customData;

      for (s = 0; s < split.length; s++) {
        if (typeof dataval !== 'undefined') {
          dataval = dataval[split[s]];
        }
      }
    }

    var val;

    // replace the template with the lytics data value
    if (typeof dataval !== 'undefined') {
      val = currentVal.replace(found[f], dataval);
    // if there's no default and we should error
    } else if ((!def || def.length === 0) && widget.displayConditions.showOnMissingFields !== true) {
      return false;
    // replace with the default option, or empty string if not found
    } else {
      val = currentVal.replace(found[f], def);
    }

    setObjectValue(widget, fieldName, val);
    currentVal = val;
  }

  if (isFn) {
    var fun;

    if (fnParams) {
      fun = new Function(fnParams.join(','), getObjectValue(widget, fieldName));
    } else {
      fun = new Function(getObjectValue(widget, fieldName));
    }

    console.log(fun.toString());
    setObjectValue(widget, fieldName, fun);
  }

  return true;
}
