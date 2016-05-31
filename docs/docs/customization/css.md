## Custom CSS

[NEEDS: description]

Key Class Names:
- `pf-widget` - 
- `pf-widget-[layout name]`
- `pf-widget-content`
- `pf-widget-headline`
- `pf-widget-btn`
- `pf-widget-close`
- `pf-widget-ok`
- `pf-widget-cancel`


All modules have the `pf-widget` class, thus any styles applied to this class and sub-elements will effect all widgets used on the page. To 

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


