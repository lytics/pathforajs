var module = pathfora.SiteGate({
  id: 'social-sitegate',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  showSocialLogin: true
});

pathfora.integrateWithFacebook('{{ Facebook App ID }}');
pathfora.integrateWithGoogle('{{ Google API ClientID }}');
pathfora.initializeWidgets([ module ]);