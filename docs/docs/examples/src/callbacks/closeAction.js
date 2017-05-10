var module = new pathfora.Message({
  id: 'close-callback',
  layout: 'modal',
  msg: 'Click the "close" button to see the callback',
  closeAction: {
    name: 'custom close',
    callback: function (event, payload) {
      alert('cancel callback');
      console.log(payload);
    }
  }
});

pathfora.initializeWidgets([module]);
