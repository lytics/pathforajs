[![Build Status](https://travis-ci.org/pathfora/pathforajs.svg?branch=master)](https://travis-ci.org/pathfora/pathforajs)

# Pathfora.js
  Lightweight library for displaying widgets on your website. 
  Integrates with your Lytics account for tracking user actions, and conditionally displaying widgets based on user segment. 
  For more info, and full configuration examples please check wiki pages.

## Gulp tasks

### gulp.build:styles

Process and minify all `.less` files from the `src` directory and put them into `dist`.
Appends `.min` suffix to the processed files.

### gulp.build:js

Uglify `.js` files from the `src` directory and put them into `dist`.
Appends `.min` suffix to the processed files.

### gulp.watch

Watch all files in `src` directory and run `default` task on change.

### gulp.default

Run all `build:*` tasks.

## General Usage
  1. Add lytics tracking tag https://activate.getlytics.com/#/documentation/jstag_anon into your website, and import pathfora.js file.
  
    ```html
    <html>
        <head>
            <title>Pathfora example</title>
        </head>
        <body>
            <h1>This is example usage of Pathfora SDK</h1>
            <div>
                <p>Page content<p>
            </div>
            <script src="https://api.lytics.io/api/tag/XXXXXXXXXXX/lio.js"></script>
            <script src="js/pathfora.js"></script>
            <script src="js/example_widget.js"></script>
        </body>
    </html>
    ```
    
  2. Define and initialize your widgets inside <code>example_widget.js</code>
    ```javascript
    // Lytics Customer ID, use your ID from Lytics account settings here
    var lyticsID = 1234
     
    var promoWidget = new pathfora.Message({
        layout: "modal",
        msg: "Welcome to our website"
    });
    
    var subscribe = new pathfora.Subscription({
        layout: "bar",
        msg: "Signup to get updates right into your inbox"
    });
    
    
    // Initialization
    pathfora.initializeWidgets([promoWidget, subscribe], lyticsID);
    ```
    

  
## Targeting example
  Example usage of lytics segments, for displaying message conditionally specific target users
  
  ```javascript
  var message1 = new pathfora.Message({
      msg: "Welcome to our site",
      layout: 'modal'
  });
  
  var message2 = new pathfora.Message({
      msg: "Nice to see you again",
      layout: 'modal'
  });
  
  var message3 = new pathfora.Message({
      msg: "Hi, please check our new stuff",
      layout: 'modal'
  });
  
  var widgets = {
      targeted: [{
          segment: 'smt_new',
          widgets: [message1]
      },{
          segment: 'subscriber',
          widgets: [message2]
      },{
          segment: 'all',
          widgets: [message3]
      }]
  };
  
  // Please set your Lytics Id below
  var lyticsId = 1234;
  
  pathfora.initalizeWidgets(widgets, lyticsId);
  ```
        
## Widgets
  There are 3 types of widgets available - message, form and subscription.
  
**Widgets are displayed in one of following layouts:**
 
  - Modal - covering entire screen.
   
  - Slideout - sliding from left or right side of a screen.
    
  - Folding - stays always on the screen.
    Not available in message widgets.
    
  - Bar - positioned on top or bottom of a page. Scrolling with page, or stays at place.
    Not available on form widgets.
    
  - Button - simple call for action. Allows chaining other widgets for example opening modal.
    Requires widget type to be message.

  
**All widgets are available in following color themes:**
  
  - Default
  - Light
  - Dark
  - Custom - allows specifying custom colors for all widget elements.
  
### Message/Promo
  Used for displaying messages to user. Optional action button allows running callback function or opening links.
  
  **required params:**
  ```
  msg: [string]
  layout: ['modal' | 'slideout' | 'button' | 'bar']
  ```
  

### Email form
  Simple contact form for writing email messages. Sent emails are stored on your Lytics stream.
  
  **required params:**
  ```
  msg: [string]
  layout: ['modal' | 'slideout' | 'folding']
  ```
    
### Subscription
  Subscription widget. Subscribed emails are available in Lytics stream.
  
  **required params:**
  ```
  msg: [string]
  layout: ['modal' | 'slideout' | 'folding' | 'bar']
  ```

### Event Callbacks

All widget callbacks provide two arguments to the callback functions - `event type` and a `payload`. Event type is always a ***String***, while payload is always an ***Object*** with context-dependent properties.

#### `widget.onInit(event, payload)`

```js
var modal = pathfora.Message({
  id: 'modal-ID',
  layout: 'modal',
  msg: 'Modal text',
  onInit: function (event, payload) {
    // Modal is initialized, but not yet visible
  }
});
```

Event is fired when the widget is added to the Pathforas' widgets list. Payload provides the `widget` data.

#### `widget.onLoad(event, payload)`

```js
var modal = pathfora.Message({
  id: 'button-ID',
  layout: 'button',
  msg: 'Button text',
  onLoad: function (event, payload) {
    // Button has been added to the website and is visible to the user
  }
});
```

Event is fired when the widget is rendered and visible to the user. Payload provides the `widget` data and the rendered `node` element (DOMElement).

#### `widget.onClick(event, payload)`

```js
var modal = pathfora.Message({
  id: 'button-ID',
  layout: 'button',
  msg: 'Button text',
  onClick: function (event, payload) {
    // Button has been clicked
  }
});
```

Only `button` layout widgets.
Event is fired when the widget button is clicked. Payload provides the `widget` data and the original click `event` payload.

#### `widget.onFormSubmit(event, payload)`

```js
var modal = pathfora.Form({
  msg: 'Subscription',
  header: 'Header',
  layout: 'slideout',
  position: 'left',
  onFormSubmit: function (event, payload) {
    // Form has been submitted
    // Payload:
    // {
    //   event: ...,
    //   widget: ...,
    //   data: [
    //     { name: 'input1', value: 'value1' },
    //     { name: 'input2', value: 'value2' },
    //     ...
    //   ]
    // }
  }
});
```

Only `Form` type widgets.
Event is fired when the form in the widget is submitted. Payload provides the `widget` data,  the original form submit `event` payload and the `data` input values from the form.

#### `widget.onModalOpen(event, payload)` / `widget.onModalClose(event, payload)`

Similar to `onLoad(event, payload)`, only for `modal` layout widgets.
Event is fired when the widget is opened/closed. Payload provides the `widget` data and the original `event` payload, if available.
Event is called simultaneously with `onFormSubmit`.
