var module = new pathfora.Message({
  id: 'twitter-module',
  className: 'pf-twitter-module',
  layout: 'slideout',
  headline: 'Thank You!',
  msg: 'We hope you are enjoying your recent purchase, and we\'d love to hear from you! Send us a tweet and let us know what you think.',
  okMessage: 'Tweet @ us!',
  cancelMessage: 'No Thanks',
  variant: 2,
  image: '../../../../assets/twitter.png',
  theme: 'custom',
  branding: false
});

pathfora.initializeWidgets([module]);
