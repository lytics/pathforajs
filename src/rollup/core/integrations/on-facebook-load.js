/** @module core/on-facebook-load */

import autoCompleteFacebookData from './auto-complete-facebook-data'
import onFacebookClick from './on-facebook-click'

export default function onFacebookLoad () {
  var fbBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.facebook-login-btn span'));

  FB.getLoginStatus(function (connection) {
    if (connection.status === 'connected') {
      autoCompleteFacebookData(fbBtns);
    }
  });

  fbBtns.forEach(function (element) {
    if (element.parentElement) {
      element.parentElement.onclick = function () {
        onFacebookClick(fbBtns);
      };
    }
  });
};