/** @module pathfora/data/segments/in-segment */

import getUserSegments from './get-user-segments';

/**
 * Check if the user is a member of a segment
 *
 * @exports inSegment
 * @params {string} match
 * @returns {boolean} membership
 */
export default function inSegment (match) {
  return (getUserSegments().indexOf(match) !== -1);
}
