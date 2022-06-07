/** @module pathfora/validation/validate-options */

import { OPTIONS_PRIORITY_ORDERED, OPTIONS_PRIORITY_UNORDERED } from '../globals/config';

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
      case OPTIONS_PRIORITY_UNORDERED:
        break;
      default:
        throw new Error('Invalid priority defined in options.');
      }
    }
  }
}
