var module = pathfora.Message({
  id: 'slideout-image',
  layout: 'slideout',
  headline: 'Welcome',
  msg: 'Welcome to our website.',
  variant: 2,
  image: '/assets/lion.jpg'
});

pathfora.initializeWidgets([ module ]);