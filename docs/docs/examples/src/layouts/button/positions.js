var moduleLeft = pathfora.Message({
  id: 'button-left',
  position: 'left',
  layout: 'button',
  msg: 'Left',
});

var moduleRight = pathfora.Message({
  id: 'button-right',
  layout: 'button',
  position: 'right',
  msg: 'Right',
});

var moduleTopLeft = pathfora.Message({
  id: 'button-top-left',
  layout: 'button',
  position: 'top-left',
  msg: 'Top Left',
});

var moduleTopRight = pathfora.Message({
  id: 'button-top-right',
  layout: 'button',
  position: 'top-right',
  msg: 'Top Right',
});

var moduleBottomLeft = pathfora.Message({
  id: 'button-bottom-left',
  layout: 'button',
  position: 'bottom-left',
  msg: 'Bottom Left',
});

var moduleBottomRight = pathfora.Message({
  id: 'button-bottom-right',
  layout: 'button',
  position: 'bottom-right',
  msg: 'Bottom Right',
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