/** @module pathfora/utils/escape-regex */

/**
 * Ensure that a string does not contain regex
 *
 * @exports escapeURI
 * @params {string} text
 * @returns {object} options
 * @returns {string} uri
 */
export default function escapeRegex (s) {
  return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
