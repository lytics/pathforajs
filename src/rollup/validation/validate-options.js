/** @module pathfora/validation/validate-options */

import { OPTIONS_PRIORITY_ORDERED } from '../globals/config';

/**
 * Validate and set the Lytics account Id
 *
 * @exports validateAccountId
 * @params {object} pf
 */
export default function validateOptions (options) {
  if (options) {
    // validate priority
    if (options.priority) {
      switch (options.priority) {
      case OPTIONS_PRIORITY_ORDERED:
        break;
      default:
        throw new Error('Invalid priority defined in options.');
      }
    }
  }
}
