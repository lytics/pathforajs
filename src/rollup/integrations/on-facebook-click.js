/** @module pathfora/integrations/on-facebook-click */

// dom
import window from '../dom/window';

// form
import clearFormFields from '../form/clear-form-fields';

// integrations
import autoCompleteFacebookData from './auto-complete-facebook-data';

/**
 * Setup login when the user clicks the fb
 * social login button
 *
 * @exports onFacebookClick
 * @params {array} elements
 */
export default function onFacebookClick (elements) {
  window.FB.getLoginStatus(function (connection) {
    if (connection.status === 'connected') {
      window.FB.logout(function () {
        elements.forEach(function (elem) {
          elem.innerHTML = 'Log In';
        });
        clearFormFields('facebook', ['username', 'email']);
      });

    } else {
      window.FB.login(function (resp) {
        if (resp.authResponse) {
          autoCompleteFacebookData(elements);
        }
      });
    }
  });
}
