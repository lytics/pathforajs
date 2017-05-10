/** @module core/auto-complete-facebook-data */

import autoCompleteFormFields from '../form/auto-complete-form-fields'
import window from '../dom/window'

export default function autoCompleteFacebookData (elements) {
  window.FB.api('/me', {
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