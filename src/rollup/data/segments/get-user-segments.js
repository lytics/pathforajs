/** @module api/segments/get-user-segments */

import window from '../../dom/window'

export default function getUserSegments () {
  if (window.lio && window.lio.data && window.lio.data.segments) {
    return window.lio.data.segments;
  } else {
    return ['all'];
  }
};