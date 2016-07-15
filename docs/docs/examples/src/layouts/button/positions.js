var moduleLeft = new pathfora.Message({
  id: 'button-left',
  position: 'left',
  layout: 'button',
  msg: 'Left'
});

var moduleRight = new pathfora.Message({
  id: 'button-right',
  layout: 'button',
  position: 'right',
  msg: 'Right'
});

var moduleTopLeft = new pathfora.Message({
  id: 'button-top-left',
  layout: 'button',
  position: 'top-left',
  msg: 'Top Left'
});

var moduleTopRight = new pathfora.Message({
  id: 'button-top-right',
  layout: 'button',
  position: 'top-right',
  msg: 'Top Right'
});

var moduleBottomLeft = new pathfora.Message({
  id: 'button-bottom-left',
  layout: 'button',
  position: 'bottom-left',
  msg: 'Bottom Left'
});

var moduleBottomRight = new pathfora.Message({
  id: 'button-bottom-right',
  layout: 'button',
  position: 'bottom-right',
  msg: 'Bottom Right'
});

var modules = [
  moduleLeft,
  moduleRight,
  moduleTopLeft,
  moduleTopRight,
  moduleBottomLeft,
  moduleBottomRight
];

pathfora.initializeWidgets(modules);
