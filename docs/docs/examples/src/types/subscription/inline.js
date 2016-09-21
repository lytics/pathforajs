var module = new pathfora.Subscription({
  id: 'message-inline',
  layout: 'inline',
  position: '.inline-module',
  headline: 'Sign up!',
  msg: 'Sign up to get newsletter updates.'
});

pathfora.initializeWidgets([module]);
