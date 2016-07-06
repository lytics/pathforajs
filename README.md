[![Build Status](https://travis-ci.org/lytics/pathforajs.svg?branch=develop)](https://travis-ci.org/lytics/pathforajs)

# Pathfora JS
Pathfora JS is a lightweight SDK for displaying personalized modules on your website, it integrates with your [Lytics](http://www.getlytics.com/) account to track user actions, and conditionally display modules based on your users' audience membership. For more info and full configuration examples check out the [full documentation](https://lytics.github.io/pathforadocs/).
        
## Modules
There are 4 types of modules and 4 layouts currently supported.

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
1. Add [Lytics tracking tag](https://activate.getlytics.com/#/documentation/jstag_anon) to your website, and import pathfora.js file.

  ``` html
  <!-- Your Lytics JS Tag -->
  <script src="https://c.lytics.io/api/tag/YOUR LYTICS API KEY/lio.js"></script>

  <!-- Pathfora Tag -->
  <script src="http://c.lytics.io/static/pathfora.min.js"></script>
  ```

2. Set up your module configuration, a simple example is provided below. See the [documentation](http://lytics.github.io/pathforadocs/) for a full list of settings and examples.

  ```javascript
  // example: show a bar module with a button leading to a new products page

  var module = new pathfora.Message({
    id: 'bar-valued-customers',
    layout: 'bar',
    msg: 'Thanks for being a valued customer, please check out our new products.',
    cancelShow: false,
    okMessage: 'View Now',
    confirmAction: {
      name: 'view now',
      callback: function () {
        window.location.pathname = '/new-products';
      }
    }
  });

  pathfora.initializeWidgets([module]);
  ```

## Development
Pathfora uses [NPM](https://docs.npmjs.com/) for package management, and [Gulp](https://github.com/gulpjs/gulp) to manage build tasks.

Install Dependencies:

```sh
$ npm install --global gulp-cli
$ npm install
```

Gulp tasks:

- **`gulp build`** - minify `LESS` files, lint and uglify `js` files in the `src` directory, and place output in `dist` directory.

- **`gulp`** - runs the `build` tasks above and watches for any changes in the `src` directory, files are served on `localhost` port `8080`.

- **`gulp docs`** - [see below](#documentation).

- **`gulp lint`** - lint all the `js` source files with the rules defined in [.eslintrc](https://github.com/lytics/pathforajs/blob/develop/.eslintrc).

- **`gulp local`** - reads some config params from an optional local file, `.env.json` and builds and watches as with the default gulp task. This can allow you to test CSS changes locally (by default `dist/pathfora.min.js` loads the most recently deployed CSS file) or override the Lytics API URL. 

  Example `.env.json` file, (using local CSS):

  ```json
  {
    "APIURL": "https://api.lytics.io",
    "CSSURL": "http://localhost:8080/dist/pathfora.min.css"
  }
  ```

### Documentation
Documentation for the most recent release is available [here](http://lytics.github.io/pathforadocs/).

You can also view and add to the docs by running the `gulp docs` task. Our docs are powered by [mkdocs](http://www.mkdocs.org/) which you must install before attempting to run the docs.

```sh 
$ pip install mkdocs
$ gulp docs
```

Documentation will be served on `localhost` port `8000` while running this task.

The source code for all the examples provided in the documentation can be found in `docs/docs/examples/src`. Preview images for the examples are stored in `docs/docs/examples/images`.

The docs task will walk through every `.js` file in the examples source directory and compile it as a working html example in `docs/docs/examples/preview` using a handlebars template. These js files also get used as the source code to populate the `<pre>` elements within the docs.

This allows us to keep our source code in one place. Changing a js file in the examples source folder will change the code snippet in the docs and update the example .html file.

### Testing
Pathfora uses [Jasmine](https://github.com/jasmine/jasmine) as a test framework, and [Karma](https://github.com/karma-runner/karma/) to run tests. Before running tests, or commiting changes be sure to run `gulp build` instead of `gulp local`, or tests may fail due to mismatching URLs.

Running tests:
``` sh
$ gulp build && karma start --single-run --browsers PhantomJS
```
