var module = new pathfora.Subscription({
  id: 'message-inline',
  layout: 'inline',
  position: '.inline-module',
  headline: 'Welcome!',
  msg: 'Please sign up for our newsletter for more updates.',
  variant: 4,
  backgroundImage: {
    src: '../../../../assets/desk.png'
  }
});

pathfora.initializeWidgets([module]);
