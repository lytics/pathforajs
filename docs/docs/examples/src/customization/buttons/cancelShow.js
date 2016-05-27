var module = pathfora.Message({
  id: 'hide-buttons',
  layout: 'slideout',
  headline: 'Welcome!',
  msg: 'Check out this new piece of content',
  cancelShow: false
});

window.pathfora.initializeWidgets([ module ]);