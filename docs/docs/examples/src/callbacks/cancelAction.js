var module = new pathfora.Message({
  id: 'cancel-callback',
  layout: 'modal',
  msg: 'Click the "cancel" button to see the callback',
  cancelAction: {
    name: 'custom cancel',
    callback: function () {
      alert('cancel callback');
    }
  }
});

pathfora.initializeWidgets([module]);
