var initModule = pathfora.Message({
  id: 'onInit-callback',
  layout: 'modal',
  msg: 'Check the console log',
  onInit: function (event, module) {
    console.log("OnInit Callback: ");
    console.log(event);
    console.log(module);
  }
});

pathfora.initializeWidgets([ initModule ]);