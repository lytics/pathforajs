/** @module pathfora/utils/is-not-encoded */

/**
 * Check if a string is encoded or not.
 *
 * @exports isNotEncoded
 * @params {string} s
 * @returns {boolean} isNotEncoded
 */
export default function isNotEncoded (s) {
  try {
    return decodeURIComponent(s) === s && encodeURIComponent(s) !== s;
  } catch (e) {
    return false;
  }
}
