[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lytics/pathforajs/blob/develop/LICENSE.md)
[![Build Status](https://travis-ci.org/lytics/pathforajs.svg?branch=develop)](https://travis-ci.org/lytics/pathforajs)
[![dependencies Status](https://david-dm.org/lytics/pathforajs/status.svg)](https://david-dm.org/lytics/pathforajs)
[![devDependencies Status](https://david-dm.org/lytics/pathforajs/dev-status.svg)](https://david-dm.org/lytics/pathforajs?type=dev)
[![codecov](https://codecov.io/gh/lytics/pathforajs/branch/develop/graph/badge.svg)](https://codecov.io/gh/lytics/pathforajs)

# Pathfora JS
Pathfora JS is a lightweight SDK for displaying personalized modules on your website, it integrates with your [Lytics](http://www.getlytics.com/) account to track user actions, and conditionally display modules based on your users' audience membership. For more info and full configuration examples check out the [full documentation](https://lytics.github.io/pathforadocs/).

## Modules
There are 4 types of modules and 5 layouts currently supported.

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
  - **Inline** - A module which can be inserted into an existing div on a page.

## General Usage
1. Add [Lytics tracking tag](https://learn.lytics.com/understanding/product-docs/lytics-javascript-tag/configuration) to your website, and import pathfora.js file.

  ``` html
  <!-- Pathfora Tag -->
  <script src="https://c.lytics.io/static/pathfora.min.js"></script>
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

## Communication
**`slack`** - There’s a [slack channel](https://join.slack.com/t/pathforajs/shared_invite/enQtMjcyNDEzMDY4NzIxLTI5ZDIyMDI2NGEzNjU4NDE3MTgyOWQ2YzM5MzhjZjVmZDljMDE3NmU5MDFmYmExNTA5ODlhZmE4NmM2ZmE3MTI). Feel free to join and collaborate!

## Contributing to Pathfora
[See contribution notes](CONTRIBUTION.md)

## Development
Pathfora uses [NPM](https://docs.npmjs.com/) for package management, [rollup](https://github.com/rollup/rollup) as a module bundler, and [Gulp](https://github.com/gulpjs/gulp) to manage build tasks.

Install Dependencies:

```sh
$ npm install --global gulp-cli
$ npm install
```

Gulp tasks:

- **`gulp build`** - minify `LESS` files. Bundle, lint and uglify `js` modules in the `src/rollup` directory, and place output files in `dist` directory.

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

Useful NPM scripts:

- **`npm test`** - builds and activates Karma test runner on PhantomJS.

- **`npm run clean`** - removes files from the `./dist` folder for a clean build.

- **`npm run build:prod`** - sets `NODE_ENV` to `production` and builds minified files in `./dist` folder.

- **`npm run prod`** - run tests, clean and rebuild the `/dist` folder. This is built on top of the `gulp build`
command. Important to know that this sets the `NODE_ENV` to `production`, removing instabul instrumentation for code coverage. Currently, this is the default command used for our Travis CI.

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
$ gulp build && karma start --single-run
```

## License
[MIT](LICENSE.md)
Copyright (c) 2017, 2016, 2015 Lytics
