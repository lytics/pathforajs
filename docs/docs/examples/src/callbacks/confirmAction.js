var module = new pathfora.Message({
  id: 'confirm-callback',
  layout: 'modal',
  msg: 'Click the "confirm" button to see the callback',
  confirmAction: {
    name: 'custom confirm',
    callback: function (event, payload) {
      alert('confirm callback');
      console.log(payload);
    }
  }
});

pathfora.initializeWidgets([module]);
