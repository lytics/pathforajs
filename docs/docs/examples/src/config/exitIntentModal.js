var subscription = new pathfora.Message({
  layout: 'modal',
  id: 'modal-subscription',
  headline: 'Don\'t leave yet!',
  msg: 'Please, anything but that.',
  theme: 'dark',
  okMessage: 'Hmm. Okay.',
  okShow: true,
  displayConditions: {
    showOnExitIntent: true
  }
});

pathfora.initializeWidgets([subscription]);
