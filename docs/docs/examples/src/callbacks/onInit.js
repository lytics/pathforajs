var initModule = pathfora.Message({
  id: 'onInit-callback',
  layout: 'modal',
  msg: 'Check the console log',
  onInit: function (event, module) {
    console.log('OnInit Callback', event, module);
  }
});

pathfora.initializeWidgets([ initModule ]);