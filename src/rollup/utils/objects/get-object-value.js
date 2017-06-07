/** @module pathfora/utils/objects/get-object-value */

/**
 * Get the value of a field on an object, supports
 * nested objects using the key dot notation.
 *
 * @exports getObjectValue
 * @params {object} object
 * @params {string} key
 */
export default function getObjectValue (object, key) {
  var parent = object;
  var fields = key.split('.');
  for (var i = 0; i < fields.length; i++) {
    if (typeof parent !== 'undefined') {
      parent = parent[fields[i]];
    }
  }

  return parent;
}
