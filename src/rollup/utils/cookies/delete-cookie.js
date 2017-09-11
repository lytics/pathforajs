/** @module pathfora/utils/cookie/delete-cookie */

import saveCookie from './save-cookie';

/**
 * Delete a cookie
 *
 * @exports deleteCookie
 * @params {string} name
 */
export default function deleteCookie (name) {
  var date = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
  saveCookie(name, '', date);
}
