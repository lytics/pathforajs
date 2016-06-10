var module = pathfora.Message({
  id: 'onLoad-callback',
  layout: 'modal',
  msg: 'Check the console log',
  onLoad: function (event, payload) {
    console.log('OnLoad Callback: ');
    console.log(event);
    console.log(payload);
  }
});

pathfora.initializeWidgets([ module ]);