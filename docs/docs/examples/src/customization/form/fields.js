var module = pathfora.Form({
  id: 'form-modal',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  fields: {
    username: false,
    title: false,
    email: true,
    message: true
  }
});

pathfora.initializeWidgets([ module ]);