/** @module core/auto-complete-google-data */

import autoCompleteFormFields from '../form/auto-complete-form-fields'

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
};