var module = pathfora.Subscription({
  id: 'subscription-bar',
  layout: 'bar',
  headline: 'Sign up!',
  msg: 'Sign up to get newsletter updates.',
});

window.pathfora.initializeWidgets([ module ]);