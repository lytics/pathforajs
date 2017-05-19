/** @module pathfora/data/segments/get-user-segments */

import window from '../../dom/window';

/**
 * Get a list of Lytics segments for the user
 *
 * @exports getUserSegments
 * @returns {array} segments
 */
export default function getUserSegments () {
  if (window.lio && window.lio.data && window.lio.data.segments) {
    return window.lio.data.segments;
  } else {
    return ['all'];
  }
}
