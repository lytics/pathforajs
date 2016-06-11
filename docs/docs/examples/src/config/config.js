var config = {
  // Most general settings
  generic: {
    headline: 'Welcome',
    theme: 'custom',
    colors: {
      background: '#3f4057',
      text: '#d9daeb',
      headline: '#fff',
      close: '#a6a8c7',
      actionBackground: '#9b9cba',
      actionText: '#3f4057',
      fieldBackground: '#cdcee4'
    }
  },

  // Message settings will overwrite the "generic"
  // settings for all message modules
  message: {
    cancelShow: false,
    okMessage: 'View Content',
  },

  // Form settings will overwrite the "generic"
  // settings for all form modules
  form: {
    okMessage: "Submit Form",
    fields: {
      title: false
    },
    colors: {
      cancelBackground: '#72738a',
      cancelText: '#fff'
    }
  },

  // Subscription settings will overwrite the "generic"
  // settings for all subscription
  subscription: {
    colors: {
      fieldBackground: '#fff',
      actionBackground: '#fff'
    }
  }
}

var slideoutMsg = pathfora.Message({
  id: 'slideoutMsg',
  layout: 'slideout',
  position: 'bottom-right',
  msg: 'Slideout Message'
});

var barSub = pathfora.Subscription({
  id: 'barSubscription',
  layout: 'bar',
  msg: 'Bar Subscription'
});

var slideoutForm = pathfora.Form({
  id: 'slideoutForm',
  layout: 'slideout',
  msg: 'Slideout Form'
});

var buttonMsg = pathfora.Message({
  id: 'buttonMsg',
  layout: 'button',
  position: 'right',
  msg: 'Button Module',

  // settings in the module definition will override
  // anything in generic and the type specific settings
  theme: 'dark'
});

var modules = [
  slideoutMsg,
  barSub,
  slideoutForm,
  buttonMsg
];

pathfora.initializeWidgets(modules, '', config);