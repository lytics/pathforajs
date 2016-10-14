var module = new pathfora.Message({
  id: 'message-inline',
  layout: 'inline',
  position: '.inline-module',
  headline: 'Welcome to our website',
  msg: 'Please enjoy your visit.'
});

pathfora.initializeWidgets([module]);
