var module = pathfora.Message({
  id: 'bar-push-down',
  layout: 'bar',
  headline: 'Welcome',
  position: 'top-fixed',
  msg: 'Welcome to our website.',
  pushDown: '.myElementClass'
});

window.pathfora.initializeWidgets([ module ]);