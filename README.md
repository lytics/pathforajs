[![Build Status](https://travis-ci.org/lytics/pathforajs.svg?branch=develop)](https://travis-ci.org/lytics/pathforajs)

# Pathfora.js
Lightweight library for displaying widgets on your website. Integrates with your Lytics account for tracking user actions, and conditionally displaying widgets based on user segment. For more info, and full configuration check out the [full documentation](#documentation).
        
## Modules
There are 4 types of modules and 4 layouts currently supported. For more information, see our [documentation](#documentation).

**Modules can be of the following types:**

  - **Message** - Module with a simple text message.
   
  - **Form** - Module with a form to capture user information, can contain fields for `name`, `email`, `title` and `message`.
    
  - **Subscription** - Module with a single input field, `email`.
    
  - **Gate** - Module which gates the page behind it, the user cannot view the page until they enter information into the gate form. Can contain form fields for `name`, `email`, `organization`, `title`.
  
**Modules are displayed in one of following layouts:**
 
  - **Modal** - A large size module with an overlay behind it - meant to cover a substantial area of the browser window, so that it demands attention from the user.
   
  - **Slideout** - A medium module which slides from either side into the window.
    
  - **Bar** - A thin module which appears at the top or bottom of the browser window.
    
  - **Button** - A small module which only allows for a short call to action and a single click action.

## General Usage
1. Add [lytics tracking tag](https://activate.getlytics.com/#/documentation/jstag_anon) to your website, and import pathfora.js file.

  ``` html
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
          <script src="http://c.lytics.io/static/pathfora.min.js"></script>
      </body>
  </html>
  ```

2. Set up your module configuration, simple example provided below. See the documentation for a full list of settings and examples.

  ```javascript
  // example: show a bar module with a button leading to a new products page

  var module = pathfora.Message({
    id: 'bar-valued-customers',
    layout: 'bar',
    msg: 'Thanks for being a valued customer, please check out our new products.'
    cancelShow: false,
    okMessage: 'View Now',
    confirmAction: {
      name: "bar-valued-customers-confirm",
      callback: function () {
        window.location.pathname = "/new-products";
      }
    }
  });

pathfora.initializeWidgets([ module ]);
```

## Development
Pathfora uses [NPM](https://docs.npmjs.com/) for package management, and [Gulp](https://github.com/gulpjs/gulp) to manage build tasks.

Install Dependencies:

```sh
$ npm install --global gulp-cli
$ npm install
```

Gulp tasks:

- **`gulp build`** - minify `LESS` files and uglify `js` files in the `src` directory, and place output in `dist` directory.
- **`gulp`** - runs the `build` tasks above and watches for any changes in the `src` directory, files are served on `localhost` port `8080`.
- **`gulp docs`** - see [below](#documentation).
- **`gulp local`** - reads some config params from an optional local file, `.env.json` and builds and watches as with the default gulp task. This can allow you to test CSS changes locally (by default `dist/pathfora.min.js` loads the most recently deployed CSS file) or override the Lytics API URL. Below is an example `.env.json` file, which will use local CSS:

```json
{
  "APIURL": "https://api.lytics.io",
  "CSSURL": "http://localhost:8080/dist/pathfora.min.css"
}
```

### Documentation
Soon we will be hosting Pathfora documentation externally, for now documentation can be run locally and contributed to, using the `gulp docs` task. Our docs are powered by [mkdocs](http://www.mkdocs.org/) which you much install before running the `gulp docs` task.

```sh 
$ pip install mkdocs
$ gulp docs
```

Documentation will serve on `localhost` port `8000` while running this task.

The source code for all the examples provided in the documentation live in `docs/docs/examples/src`. Preview images for the examples live in `docs/docs/examples/images`.

The docs task will walk through every `.js` file in the examples source directory and compile it as a working html example in `docs/docs/examples/preview` using a handlebars template. These js files also get used are the source code to populate the `<pre>` elements within the docs.

This allows us to keep our source code in one place. Changing a js file in the examples source folder will change the code snippet in the docs and update the example .html file.

### Testing
Pathfora uses [Jasmine](https://github.com/jasmine/jasmine) as a test framework, and [Karma](https://github.com/karma-runner/karma/) to run tests. Before running tests, or commiting changes be sure to run `gulp build` instead of `gulp local`, or tests will fail due to mismatching URLs.

Running tests:
``` sh
$ gulp build && karma start --single-run --browsers PhantomJS
```