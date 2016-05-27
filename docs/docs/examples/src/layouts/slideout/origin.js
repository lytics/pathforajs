var module = pathfora.Message({
  id: 'slideout-image',
  layout: 'slideout',
  headline: 'Welcome',
  msg: 'Welcome to our website.',
  position: 'bottom-right',
  origin: 'bottom',
});

window.pathfora.initializeWidgets([ module ]);