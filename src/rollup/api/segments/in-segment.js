/** @module api/segments/in-segment */

import getUserSegments from './get-user-segments'

export default function inSegment (match) {
  return (getUserSegments().indexOf(match) !== -1);
};
