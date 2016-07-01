var module = new pathfora.Message({
  id: 'bar-image',
  layout: 'bar',
  msg: 'Welcome to our website.',
  variant: 2,
  image: '../../../../assets/lion.jpg'
});

pathfora.initializeWidgets([module]);
