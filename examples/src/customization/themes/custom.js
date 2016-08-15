var module = new pathfora.Form({
  id: 'custom-theme',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates',
  theme: 'custom',
  colors: {
    background: '#f0f1ec',
    text: '#555555',
    headline: '#d35145',
    close: '#d35145', // "x" button
    actionBackground: '#d35145', // confirm button
    actionText: '#fff',
    cancelBackground: '#a09f93', // cancel button
    cancelText: '#fff',
    fieldBackground: '#e3e4e0' // form elements
  }
});

pathfora.initializeWidgets([module]);
