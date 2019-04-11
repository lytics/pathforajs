var module = new pathfora.Form({
  id: 'modal-background',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  variant: 4,
  backgroundImage: {
    src: '../../../../assets/desk.png'
  }
});

pathfora.initializeWidgets([module]);
