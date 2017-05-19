/** @module pathfora/ab-test/init-ab-test */

import saveCookie from '../utils/cookies/save-cookie';
import readCookie from '../utils/cookies/read-cookie';

import { pathforaDataObject } from '../globals/config';

/**
 * Initialized A/B test from user config
 *
 * @exports initializeABTesting
 * @params {obj} abTests
 */
export default function initializeABTesting (abTests) {
  abTests.forEach(function (abTest) {
    var abTestingType = abTest.type,
        userAbTestingValue = readCookie(abTest.cookieId),
        userAbTestingGroup = 0,
        date = new Date();

    if (!userAbTestingValue) {
      userAbTestingValue = Math.random();
    }

    // NOTE Always update the cookie to get the new exp date.
    date.setDate(date.getDate() + 365);
    saveCookie(abTest.cookieId, userAbTestingValue, date);

    // NOTE Determine visible group for the user
    var i = 0;
    while (i < 1) {
      i += abTestingType.groups[userAbTestingGroup];

      if (userAbTestingValue <= i) {
        break;
      }

      userAbTestingGroup++;
    }

    // NOTE Notify widgets about their proper AB groups
    abTest.groups.forEach(function (group, index) {
      group.forEach(function (widget) {
        if (typeof widget.abTestingGroup === 'undefined') {
          widget.abTestingGroup = index;
          widget.hiddenViaABTests = userAbTestingGroup === index;
        } else {
          throw new Error('Widget #' + widget.config.id + ' is defined in more than one AB test.');
        }
      });
    });

    if (typeof pathforaDataObject.abTestingGroups[abTest.id] !== 'undefined') {
      throw new Error('AB test with ID=' + abTest.id + ' has been already defined.');
    }

    pathforaDataObject.abTestingGroups[abTest.id] = userAbTestingGroup;
  });
}
