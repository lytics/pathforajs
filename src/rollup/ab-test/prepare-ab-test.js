/** @module pathfora/ab-test/prepare-ab-test */

import { PREFIX_AB_TEST, abTestingTypes } from '../globals/config';

export default function prepareABTest (config) {
  var test = {};

  if (!config) {
    throw new Error('Config object is missing');
  }

  test.id = config.id;
  test.cookieId = PREFIX_AB_TEST + config.id;
  test.groups = config.groups;

  if (!abTestingTypes[config.type]) {
    throw new Error('Unknown AB testing type: ' + config.type);
  }

  test.type = abTestingTypes[config.type];

  return test;
}
