# A/B Testing

## Intro

Pathfora allows the user to perform A/B testing with the widgets.

___

Example file: `./examples/AB-testing example.html`

> In the example file, we create two widgets, each in a separate testing group (groups are indexed starting from 0). As we open the page, a random value is generated into browser's cookies. According to this value, proper widgets are rendered on the page.

___

Pathfora provides currently two types of A/B testing:

## Testing Modes

### `100`

This default mode renders all widgets regardless the user visiting the page.

### `50/50`

This mode divides users into two groups, each group with their separate set of widgets on the page.

## Usage 

In order to initialize A/B testing on the website, `setABTestingMode( mode )` has to be called before widgets are created on the page. For example:

```js
window.pathfora.setABTestingMode('50/50'); // Initialize a 50/50 AB testing
window.pathfora.initializeWidgets(widgets);
```

When you initialize a mode in which widgets are displayed to users according to their testing group, you should then specify a `testGroup` parameter on the widgets (if the parameter is not defined, widget will always be visible):

```js
var messageBar = pathfora.Message({
  id: 'asd',
  layout: 'bar',
  msg: 'Welcome to our website',
  testGroup: 0
});
```

If `testGroup` parameter exceeds the amount of groups in the chosen testing mode, the last available group will be used.