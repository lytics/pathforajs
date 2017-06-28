/** @module pathfora/utils/escape-regex */

/**
 * Ensure that a string does not contain regex
 *
 * @exports escapeURI
 * @params {regex} s
 * @returns {string} regex
 */
export default function escapeRegex (s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
