var module = pathfora.Message({
  id: 'cancel-callback',
  layout: 'modal',
  msg: 'Click the "cancel" button to see the callback',
  onInit: function (event, payload) {
  	alert(event);
  }
});

pathfora.initializeWidgets([ module ]);