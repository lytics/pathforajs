var messageModule = new pathfora.Message({
  id: 'message-inline',
  layout: 'inline',
  position: '.terms-of-service',
  msg: 'Please agree to our Terms of service to continue.'
});

var formModule = new pathfora.Form({
  id: 'form-inline',
  layout: 'inline',
  position: '#form-submit',
  headline: 'Sign up',
  msg: 'Please sign up to get updates.'
});

pathfora.initializeWidgets([messageModule, formModule]);
