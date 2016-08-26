var module = new pathfora.Message({
  id: 'onLoad-callback',
  layout: 'modal',
  msg: 'Check the console log',
  onLoad: function(event, payload) {
    console.log('OnLoad Callback', event, payload);
  }
});

pathfora.initializeWidgets([module]);
