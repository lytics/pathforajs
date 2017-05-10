/** @module pathfora/integrations/on-google-click */

import autoCompleteGoogleData from './auto-complete-google-data';

import clearFormFields from '../form/clear-form-fields';

import window from '../dom/window';

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
