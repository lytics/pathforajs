var module = new pathfora.Subscription({
  id: 'form-modal',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates and see the success message.',
  confirmAction: {
    waitForAsyncResponse: true,
    callback: function (event, payload, cb) {
      var valid = true;

      // make some request to your server for validation
      // set valid to false if server response is bad.

      cb(valid);
    }
  },
  formStates: {
    success: {
      headline: 'Thanks!',
      msg: 'We have received your submission, thank you for signing up.',
      delay: 5
    },
    error: {
      headline: 'Error',
      msg: 'There was an issue submitting your subscription.',
      delay: 5
    }
  }
});

pathfora.initializeWidgets([module]);
