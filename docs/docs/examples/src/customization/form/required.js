var module = pathfora.SiteGate({
  id: 'required-fields',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  required: {
    name: false,
    email: true,
    company: false,
    title: true
  }
});

pathfora.initializeWidgets([ module ]);