var module = pathfora.Subscription({
  id: 'subscription-modal',
  layout: 'modal',
  headline: 'Sign up!',
  msg: 'Sign up to get newsletter updates.',
});

window.pathfora.initializeWidgets([ module ]);
