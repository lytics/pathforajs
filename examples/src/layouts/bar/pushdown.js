var module = new pathfora.Message({
  id: 'bar-push-down',
  layout: 'bar',
  position: 'top-fixed',
  msg: 'Welcome to our website.',
  pushDown: '.myElementClass'
});

pathfora.initializeWidgets([module]);
