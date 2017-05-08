/** @module core/on-facebook-click */

import autoCompleteFacebookData from './auto-complete-facebook-data'

export default function onFacebookClick (elements) {
  FB.getLoginStatus(function (connection) {
    if (connection.status === 'connected') {
      FB.logout(function () {
        elements.forEach(function (elem) {
          elem.innerHTML = 'Log In';
        });
        core.clearFormFields('facebook', ['username', 'email']);
      });

    } else {
      FB.login(function (resp) {
        if (resp.authResponse) {
          autoCompleteFacebookData(elements);
        }
      });
    }
  });
};