/** @module pathfora/display-conditions/date-checker */

/**
 * Check if the current date fits within the
 * date displayConitions for the widget
 *
 * @exports dateChecker
 * @params {object} date
 * @returns {boolean}
 */
export default function dateChecker (date) {
  var valid = true,
      today = Date.now();

  if (date.start_at && today < new Date(date.start_at).getTime()) {
    valid = false;
  }

  if (date.end_at && today > new Date(date.end_at).getTime()) {
    valid = false;
  }

  return valid;
}
