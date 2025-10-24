var module = new pathfora.Form({
  id: 'onSubmit-callback',
  layout: 'gate',
  msg: 'Fill out the form and submit to trigger the callback.',
  onSubmit: function (event, payload) {
    console.log('OnSubmit Callback', event, payload, payload.data);
  },
});

pathfora.initializeWidgets([module]);
