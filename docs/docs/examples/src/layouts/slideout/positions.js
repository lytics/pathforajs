var moduleLeft = pathfora.Subscription({
  id: 'slideout-left',
  layout: 'slideout',
  position: 'bottom-left',
  headline: 'Left Aligned',
});

var moduleRight = pathfora.Form({
  id: 'slideout-right',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Right Aligned',
});

pathfora.initializeWidgets([ moduleLeft, moduleRight ]);