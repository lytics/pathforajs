/** @module pathfora/utils/date-valid */

/**
 * Validate that the string is a properly formatted email
 *
 * @exports dateValid
 * @params {string} date
 * @params {string} max
 * @params {string} min
 * @returns {boolean} valid
 */
export default function dateValid (date, max, min) {
  var selectedDate = new Date(date).getTime(),
      maxDate = max ? new Date(max).getTime() : undefined,
      minDate = min ? new Date(min).getTime() : undefined;

  if (max && selectedDate > maxDate) {
    return false;
  }

  if (min && selectedDate < minDate) {
    return false;
  }

  return true;
}
