/** @module pathfora/display-conditions/pageviews/page-visits-checker */

// globals
import { PF_PAGEVIEWS } from '../../globals/config';

// utils
import read from '../../utils/persist/read';

/**
 * Check if the pagevisit count meets the requirements
 *
 * @exports pageVisitsChecker
 * @returns {boolean}
 */
export default function pageVisitsChecker (pageVisitsRequired) {
  return (read(PF_PAGEVIEWS) >= pageVisitsRequired);
}
