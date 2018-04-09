var modal = new pathfora.Form({
  id: 'sign-up-modal',
  className: 'pf-sign-up',
  layout: 'modal',
  headline: 'Welcome!',
  msg: 'Sign up to receive the latest deals.',
  okMessage: 'Confirm',
  footerText: 'I am the footer!'
});

pathfora.initializeWidgets([modal]);
