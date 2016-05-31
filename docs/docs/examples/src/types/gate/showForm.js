var module = pathfora.SiteGate({
  id: 'gate-hide-form',
  headline: 'Gated Site Feature',
  msg: 'Please agree to the terms to proceed.',
  showForm: false,
  okMessage: 'I Agree'
});

window.pathfora.initializeWidgets([ module ]);