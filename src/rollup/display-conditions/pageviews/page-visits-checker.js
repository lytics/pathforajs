/** @module pathfora/display-conditions/pageviews/page-visits-checker */

import { PF_PAGEVIEWS } from '../../globals/config';

import readCookie from '../../utils/cookies/read-cookie';

/**
 * Check if the pagevist count meets the requirements
 *
 * @exports pageVisitsChecker
 * @returns {boolean}
 */
export default function pageVisitsChecker (pageVisitsRequired) {
  return (readCookie(PF_PAGEVIEWS) >= pageVisitsRequired);
}
