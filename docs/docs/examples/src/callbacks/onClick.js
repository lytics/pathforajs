var module = new pathfora.Message({
  id: 'onClick-callback',
  layout: 'button',
  msg: 'Click Me!',
  onClick: function (event, payload) {
    console.log('OnClick Callback', event, payload);
  }
});

pathfora.initializeWidgets([module]);
