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
    // legacy
    return window.lio.data.segments;
  } else if (window.jstag && typeof window.jstag.getSegments === 'function') {
    // > jstag 3.0.0
    return window.jstag.getSegments();
  } else {
    // fallback
    return ['all'];
  }
}
