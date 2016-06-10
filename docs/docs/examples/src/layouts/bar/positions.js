var moduleTop = pathfora.Subscription({
  id: 'bar-top',
  layout: 'bar',
  position: 'top-fixed',
  msg: 'top aligned'
});

var moduleBottom = pathfora.Message({
  id: 'bar-bottom',
  layout: 'bar',
  position: 'bottom-fixed',
  msg: 'bottom aligned'
});

pathfora.initializeWidgets([ moduleTop, moduleBottom ]);