var module = pathfora.Form({
  id: 'social-form',
  layout: 'slideout',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  showSocialLogin: true
});

pathfora.integrateWithFacebook('{{ Facebook App ID }}');
pathfora.integrateWithGoogle('{{ Google API ClientID }}');
pathfora.initializeWidgets([ module ]);