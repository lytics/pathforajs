/** @module core/auto-complete-facebook-data */

import autoCompleteFormFields from '../form/auto-complete-form'

export default function autoCompleteFacebookData (elements) {
  FB.api('/me', {
    fields: 'name,email,work'
  }, function (resp) {
    if (resp && !resp.error) {
      autoCompleteFormFields({
        type: 'facebook',
        username: resp.name || '',
        email: resp.email || ''
      });

      elements.forEach(function (item) {
        item.innerHTML = 'Log Out';
      });
    }
  });
};