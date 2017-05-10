/** @module api/segments/get-user-segments */

import lio from '../../globals/lio'

export default function getUserSegments () {
  if (lio && lio.data && lio.data.segments) {
    return lio.data.segments;
  } else {
    return ['all'];
  }
};