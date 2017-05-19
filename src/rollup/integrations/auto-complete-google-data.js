/** @module pathfora/integrations/auto-complete-google-data */

import autoCompleteFormFields from '../form/auto-complete-form-fields';

/**
 * Fill in widget form with data from google login
 *
 * @exports autoCompleteGoogleData
 * @params {object} user
 * @params {array} elements
 */
export default function autoCompleteGoogleData (user, elements) {
  if (typeof user !== 'undefined') {
    var profile = user.getBasicProfile();

    if (typeof profile !== 'undefined') {
      autoCompleteFormFields({
        type: 'google',
        username: profile.getName() || '',
        email: profile.getEmail() || ''
      });

      elements.forEach(function (item) {
        item.innerHTML = 'Sign Out';
      });
    }
  }
}
