var module = pathfora.SiteGate({
  id: 'social-sitegate',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  showSocialLogin: true
});

window.pathfora.integrateWithFacebook('{{ Facebook App ID }}');
window.pathfora.integrateWithGoogle('{{ Google API ClientID }}');
window.pathfora.initializeWidgets([ module ]);