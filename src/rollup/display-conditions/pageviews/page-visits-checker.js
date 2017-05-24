/** @module pathfora/display-conditions/pageviews/page-visits-checker */

// globals
import { PF_PAGEVIEWS } from '../../globals/config';

// utils
import readCookie from '../../utils/cookies/read-cookie';

/**
 * Check if the pagevisit count meets the requirements
 *
 * @exports pageVisitsChecker
 * @returns {boolean}
 */
export default function pageVisitsChecker (pageVisitsRequired) {
  return (readCookie(PF_PAGEVIEWS) >= pageVisitsRequired);
}
