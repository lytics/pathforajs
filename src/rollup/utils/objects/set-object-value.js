/** @module pathfora/utils/objects/set-object-value */

/**
 * Set the value of a field on an object, supports
 * nested objects using the key dot notation.
 *
 * @exports setObjectValue
 * @params {object} object
 * @params {string} key
 * @params value
 * @returns {object}
 */
export default function setObjectValue (object, key, value) {
  var parent = object;
  var fields = key.split('.');
  for (var i = 0; i < fields.length - 1; i++) {
    var elem = fields[i];

    if (!parent[elem]) {
      parent[elem] = {};
    }

    parent = parent[elem];
  }

  parent[fields[fields.length - 1]] = value;

  return parent;
}
