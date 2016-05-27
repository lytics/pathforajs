## Custom CSS

[NEEDS: description]

To add custom CSS to a module we suggest adding a custom class name in the config.

```javascript
var module = pathfora.Subscription({
  id: 'form-css',
  className: 'pf-sign-up-newsletter',
  layout: 'modal',
  headline: 'Sign Up!',
  msg: 'Submit this form to get updates'
});

window.pathfora.initializeWidgets([ module ]);
```

