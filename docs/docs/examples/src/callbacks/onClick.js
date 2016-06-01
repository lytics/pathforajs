var module = pathfora.Message({
  id: 'onClick-callback',
  layout: 'button',
  msg: 'Click Me!',
  onClick: function (event, payload) {
  	console.log("OnClick Callback: ");
  	console.log(event);
  	console.log(payload);
  }
});

pathfora.initializeWidgets([ module ]);