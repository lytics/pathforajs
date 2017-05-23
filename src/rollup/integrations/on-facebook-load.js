/** @module pathfora/integrations/on-facebook-load */

// dom
import document from '../dom/document';
import window from '../dom/window';

// integrations
import autoCompleteFacebookData from './auto-complete-facebook-data';
import onFacebookClick from './on-facebook-click';

/**
 * Check if the user is already logged in once
 * the fb library is loaded and setup the click
 * listener for the social button
 *
 * @exports onFacebookLoad
 */
export default function onFacebookLoad () {
  var fbBtns = Array.prototype.slice.call(document.querySelectorAll('.social-login-btn.facebook-login-btn span'));

  window.FB.getLoginStatus(function (connection) {
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
}
