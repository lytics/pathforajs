/** @module pathfora/display-conditions/replace-entity-field */

// dom
import window from '../../dom/window';

// utils
import setObjectValue from '../../utils/objects/set-object-value';
import getObjectValue from '../../utils/objects/get-object-value';

/**
 * Fill in the data for a entity field template in
 * a widgets text field
 *
 * @exports replaceEntityField
 * @params {object} widget
 * @params {string} fieldName
 * @params {array} found
 * @returns {boolean}
 */
export default function replaceEntityField (
  widget,
  fieldName,
  found,
  customData
) {
  if (!found || !found.length) {
    return true;
  }

  var fnParams,
      fn,
      currentVal = getObjectValue(widget, fieldName),
      isFn = false;

  // special case if the field is a function, convert it to a string first
  if (typeof currentVal === 'function') {
    fn = currentVal.toString();
    currentVal = fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}')); // body of the function
    fnParams = fn.match(/(function.+\()(.+(?=\)))(.+$)/); // get the function param names
    isFn = true;
  }

  // for each template found...
  for (var f = 0; f < found.length; f++) {
    // parse the field name
    var foundval = found[f].slice(2).slice(0, -2),
        parts = foundval.split('|'),
        def = '';

    // get the default (fallback) value
    if (parts.length > 1) {
      def = parts[1].trim();
    }

    // check for subfields if the value is an object
    var split = parts[0].trim().split('.');

    // get entity data from tag
    var dataval;
    if (window.lio && window.lio.data) {
      dataval = window.lio.data;
    } else if (window.jstag && typeof window.jstag.getEntity === 'function') {
      var entity = window.jstag.getEntity();
      if (entity && entity.data && entity.data.user) {
        dataval = entity.data.user;
      }
    }

    var s;
    for (s = 0; s < split.length; s++) {
      if (typeof dataval !== 'undefined') {
        dataval = dataval[split[s]];
      }
    }

    // if we couldn't find the data in question on the lytics jstag, check customData provided
    if (typeof dataval === 'undefined') {
      dataval = customData;

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
    } else if (
      (!def || def.length === 0) &&
      widget.displayConditions.showOnMissingFields !== true
    ) {
      return false;
      // replace with the default option, or empty string if not found
    } else {
      val = currentVal.replace(found[f], def);
    }

    setObjectValue(widget, fieldName, val);
    currentVal = val;
  }

  // if the value is a function, convert it back from a string
  if (isFn) {
    if (fnParams) {
      fn = new Function(fnParams.join(','), getObjectValue(widget, fieldName));
    } else {
      fn = new Function(getObjectValue(widget, fieldName));
    }

    setObjectValue(widget, fieldName, fn);
  }

  return true;
}
