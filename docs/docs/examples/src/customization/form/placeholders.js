var module = new pathfora.Form({
  id: 'form-modal',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  placeholders: {
    name: 'Your Name',
    title: 'Job Title',
    email: 'Email Address',
    message: 'How did you hear about us?'
  }
});

pathfora.initializeWidgets([module]);
