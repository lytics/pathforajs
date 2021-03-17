var moduleCustomPosition = new pathfora.Subscription({
  id: 'bar-custom-position',
  layout: 'bar',
  position: 'top-absolute',
  positionSelector: '.overlay',
  msg: 'custom positioned bar'
});

pathfora.initializeWidgets([moduleCustomPosition]);
