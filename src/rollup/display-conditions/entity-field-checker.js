/** @module pathfora/display-conditions/entity-field-checker */

import window from '../dom/window';

export default function entityFieldChecker (widget, fieldName, found) {
  if (!found || !found.length) {
    return true;
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

    // replace the template with the lytics data value
    if (typeof dataval !== 'undefined') {
      widget[fieldName] = widget[fieldName].replace(found[f], dataval);
    // if there's no default and we should error
    } else if ((!def || def.length === 0) && widget.displayConditions.showOnMissingFields !== true) {
      return false;
    // replace with the default option, or empty string if not found
    } else {
      widget[fieldName] = widget[fieldName].replace(found[f], def);
    }
  }

  return true;
}
