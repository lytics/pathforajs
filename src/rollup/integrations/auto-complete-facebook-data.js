/** @module pathfora/integrations/auto-complete-facebook-data */

// dom
import window from '../dom/window';

// form
import autoCompleteFormFields from '../form/auto-complete-form-fields';

/**
 * Fill in widget form with data from facebook login
 *
 * @exports autoCompleteFacebookData
 * @params {array} elements
 */
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
}
