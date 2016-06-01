var module = pathfora.SiteGate({
  id: 'onSubmit-callback',
  msg: 'Fill out the form and submit to trigger the callback.',
  onSubmit: function (event, payload) {
  	console.log("OnSubmit Callback: ");
  	console.log(event);
  	console.log(payload);
  	console.log(payload.data);
  }
});

pathfora.initializeWidgets([ module ]);