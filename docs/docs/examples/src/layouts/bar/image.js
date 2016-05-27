var module = pathfora.Message({
  id: 'bar-image',
  layout: 'bar',
  headline: 'Welcome',
  msg: 'Welcome to our website.',
  variant: 2,
  image: '/assets/lion.jpg',
});

window.pathfora.initializeWidgets([ module ]);