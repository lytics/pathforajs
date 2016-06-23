var module = pathfora.Message({
  id: 'confirm-callback',
  layout: 'modal',
  msg: 'Click the "confirm" button to see the callback',
  confirmAction: {
    name: 'custom confirm',
    callback: function() {
      alert('confirm callback');
    }
  }
});

pathfora.initializeWidgets([ module ]);