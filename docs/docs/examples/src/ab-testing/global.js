var moduleA = pathfora.SiteGate({
  id: 'gate-a',
  msg: 'Please submit your information to continue.'
});

var moduleB = pathfora.Form({
  id: 'form-b',
  layout: 'modal',
  msg: 'Please submit your information.'
});

var ab = pathfora.ABTest({
  id: 'global-ab-test',
  type: '50/50',
  groups: [
    [ moduleA ], // modules to be shown to group A (can be left empty to show no modules)
    [ moduleB ] // modules to be shown to group B (can be left empty to show no modules)
  ]
});

pathfora.initializeABTesting([ ab ]); // Can define multiple A/B Tests
pathfora.initializeWidgets([ moduleA, moduleB ]);