/** @module pathfora/ab-test/ab-test */

import prepareABTest from './prepare-ab-test';

/**
 * Public wrapper method for prepareABTest
 *
 * @exports ABTest
 * @param {object} config
 * @returns {obj}
 */
export default function ABTest (config) {
  return prepareABTest(config);
}
