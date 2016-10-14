var module = new pathfora.Subscription({
  id: 'message-inline',
  layout: 'inline',
  position: '.inline-module',
  headline: 'Welcome!',
  msg: 'Please sign up for our newsletter for more updates.',
  variant: 2,
  image: '../../../../assets/lion.jpg'
});

pathfora.initializeWidgets([module]);
