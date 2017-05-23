/** @module pathfora/integrations/on-google-click */

// dom
import window from '../dom/window';

// integrations
import autoCompleteGoogleData from './auto-complete-google-data';

// form
import clearFormFields from '../form/clear-form-fields';

/**
 * Setup login when the user clicks the google
 * social login button
 *
 * @exports onGoogleClick
 * @params {array} elements
 */
export default function onGoogleClick (elements) {
  var auth2 = window.gapi.auth2.getAuthInstance();

  if (auth2.isSignedIn.get()) {
    auth2.signOut().then(function () {
      elements.forEach(function (elem) {
        elem.innerHTML = 'Sign In';
      });
      clearFormFields('google', ['username', 'email']);
    });

  } else {
    auth2.signIn().then(function () {
      autoCompleteGoogleData(auth2.currentUser.get(), elements);
    });
  }
}
