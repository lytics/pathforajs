/** @module pathfora/utils/email-valid */

/**
 * Validate that the string is a properly formatted email
 *
 * @exports emailValid
 * @params {string} email
 * @returns {boolean} valid
 */
export default function emailValid (email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  return regex.test(email);
}
