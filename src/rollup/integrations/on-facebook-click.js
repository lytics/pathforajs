/** @module core/on-facebook-click */

import autoCompleteFacebookData from './auto-complete-facebook-data'
import clearFormFields from '../form/clear-form-fields'
import window from '../dom/window'

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
};