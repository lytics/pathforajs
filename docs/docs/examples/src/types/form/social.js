var module = pathfora.Form({
  id: 'social-form',
  layout: 'slideout',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  showSocialLogin: true
});

window.pathfora.integrateWithFacebook('{{ Facebook App ID }}');
window.pathfora.integrateWithGoogle('{{ Google API ClientID }}');
window.pathfora.initializeWidgets([ module ]);