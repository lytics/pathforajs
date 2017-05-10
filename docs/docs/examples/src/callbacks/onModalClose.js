var module = new pathfora.Message({
  id: 'onModalClose-callback',
  msg: 'Click the confirm, cancel, or close button to trigger the callback.',
  onModalClose: function (event, payload) {
    console.log('OnModalClose Callback', event, payload);
  }
});

pathfora.initializeWidgets([module]);
