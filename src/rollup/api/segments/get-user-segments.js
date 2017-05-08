/** @module api/segments/get-user-segments */

export default function getUserSegments () {
  if (context.lio && context.lio.data && context.lio.data.segments) {
    return context.lio.data.segments;
  } else {
    return ['all'];
  }
};