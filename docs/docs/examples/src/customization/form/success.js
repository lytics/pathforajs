var module = new pathfora.Subscription({
  id: 'form-modal',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates and see the success message.',
  success: {
    headline: 'Thanks!',
    msg: 'We have received your submission, thank you for signing up.',
    delay: 5
  }
});

pathfora.initializeWidgets([module]);
