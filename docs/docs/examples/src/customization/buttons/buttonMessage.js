var module = pathfora.Message({
  id: 'hide-buttons',
  layout: 'slideout',
  headline: 'Welcome!',
  msg: 'Check out this new piece of content',
  okMessage: 'Show me!',
  cancelMessage: 'No Thanks'
});

pathfora.initializeWidgets([ module ]);