# Pathfora.js
  Lightweight library for displaying widgets on your website. 
  Integrates with your Lytics account for tracking user actions, and conditionally displaying widgets based on user segment. 
  For more info, and full configuration examples please check wiki pages.
  
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
     
    var promoWidget = new Pathfora.Message({
        layout: "modal",
        message: "Welcome to our website"
    });
    
    var subscribe = new Pathfora.Subscription({
        layout: "bar",
        message: "Signup to get updates right into your inbox"
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
        
## Available Widgets
  All widgets are available in following color themes:
  - Default
  - Light
  - Dark
  - Custom - allows specifying custom colors for all widget elements.
  
### Message/Promo
  Used for displaying messages to user. Optional action button allows running callback function or opening links.

  ```javascript
  var defaultPromo = new Pathfora.Message({
          layout: "modal",
          message: "Welcome to our website"
      }
  );
  ```
  

### Email form
  Simple contact form for writing email messages. Sent emails are stored on your Lytics stream.


  ```javascript
  var defaultPromo = new Pathfora.Form({
          layout: "modal",
      }
  );
  ```
    
### Subscription
  Subscription widget.
  

  ```javascript
  var defaultPromo = new Pathfora.Subscription({
          layout: "modal",
      }
  );
  ```
  
  
## Available layouts

 - Modal - covering entire screen.
 
 - Slideout - sliding from left or right side of a screen.
  
 - Folding - stays always on the screen.
  Not available in message widgets.
  
 - Bar - positioned on top or bottom of a page. Scrolling with page, or stays at place.
  Not available on form widgets.
  
 - Button - simple call for action. Allows chaining other widgets for example opening modal.
  Requires widget type to be message.
