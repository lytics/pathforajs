/** @module pathfora/utils/decode-safe */

/**
 * Try decoding a string, return original string
 * if the decode fails.
 *
 * @exports decodeSafe
 * @params {string} s
 * @returns {string} decoded
 */
export default function decodeSafe (s) {
  try {
    return decodeURIComponent(s);
  } catch (e) {
    return s;
  }
}
