var module = pathfora.Message({
  id: 'onInit-callback',
  layout: 'modal',
  msg: 'Check the console log',
  onInit: function (event, payload) {
  	console.log("OnInit Callback: ");
  	console.log(event);
  	console.log(payload);
  }
});

pathfora.initializeWidgets([ module ]);