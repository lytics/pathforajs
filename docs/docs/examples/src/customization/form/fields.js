var module = new pathfora.Form({
  id: 'form-modal',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  fields: {
    name: false,
    title: true,
    email: true,
    message: true,
    phone: false,
    company: true
  }
});

pathfora.initializeWidgets([module]);
