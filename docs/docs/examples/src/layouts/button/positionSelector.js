var moduleCustomPosition = new pathfora.Message({
  id: 'button-custom-position',
  layout: 'button',
  position: 'bottom-right',
  positionSelector: '.overlay',
  msg: 'button with a custom position'
});

pathfora.initializeWidgets([moduleCustomPosition]);
