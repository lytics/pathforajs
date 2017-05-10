/** @module pathfora/ab-test/ab-test */

import prepareABTest from './prepare-ab-test'

export default function ABTest (config) {
  return prepareABTest(config);
};