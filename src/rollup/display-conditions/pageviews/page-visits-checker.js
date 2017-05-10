/** @module core/page-visits-checker */

import { PF_PAGEVIEWS } from '../../globals/config'
import readCookie from '../../utils/cookies/read-cookie'

export default function pageVisitsChecker (pageVisitsRequired) {
  return (readCookie(PF_PAGEVIEWS) >= pageVisitsRequired);
};