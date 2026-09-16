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

**Modules are displayed in one of following layouts:**

- **Modal** - A large size module with an overlay behind it - meant to cover a substantial area of the browser window, so that it demands attention from the user.
- **Slideout** - A medium module which slides from either side into the window.
- **Bar** - A thin module which appears at the top or bottom of the browser window.
- **Button** - A small module which only allows for a short call to action and a single click action.
- **Inline** - A module which can be inserted into an existing div on a page.
- **Gate** - Module which gates the page behind it - essentailly the same as the Modal layout without the "x" button, so the user must interact with the gate content to dismiss it.

## General Usage

1. Add [Lytics tracking tag](https://docs.lytics.com/docs/lytics-javascript-tag) to your website, and import pathfora.js file.

```html
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
    },
  },
});

pathfora.initializeWidgets([module]);
```

## Communication

**`slack`** - There’s a [slack channel](https://join.slack.com/t/pathforajs/shared_invite/enQtMjcyNDEzMDY4NzIxLTI5ZDIyMDI2NGEzNjU4NDE3MTgyOWQ2YzM5MzhjZjVmZDljMDE3NmU5MDFmYmExNTA5ODlhZmE4NmM2ZmE3MTI). Feel free to join and collaborate!

## Contributing to Pathfora

[See contribution notes](CONTRIBUTION.md)

## Development

Pathfora uses [yarn](https://yarnpkg.com) for package management, [rollup](https://github.com/rollup/rollup) as a module bundler, and [Gulp](https://github.com/gulpjs/gulp) to manage build tasks.

Install Dependencies:

Note: Node v12 is not compatiable with the current set of dependencies. See https://github.com/gulpjs/gulp/issues/2324

```sh
$ yarn global add gulp-cli
$ yarn install
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
    "APIURL": "https://c.lytics.io",
    "CSSURL": "http://localhost:8080/dist/pathfora.min.css"
  }
  ```

Useful scripts:

- **`yarn test`** - builds and activates Karma test runner on PhantomJS.

- **`yarn run clean`** - removes files from the `./dist` folder for a clean build.

- **`yarn run build:prod`** - sets `NODE_ENV` to `production` and builds minified files in `./dist` folder.

- **`yarn run prod`** - run tests, clean and rebuild the `/dist` folder. This is built on top of the `gulp build`
  command. Important to know that this sets the `NODE_ENV` to `production`, removing instabul instrumentation for code coverage. Currently, this is the default command used for our Travis CI.

- **`yarn run local`** - run the gulp server to test things locally.

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

### Widget playground

`playground/` is a local page for rendering any widget type and layout, for manual
QA and for demoing. Start the dev server and open it:

```sh
$ yarn run local
```

Then visit [http://localhost:8080/playground/](http://localhost:8080/playground/).

Pick any combination from the sidebar to render it, then use either mode to configure it:

- **Form** builds the config from controls covering content, buttons, placement, theme
  and colours, all 14 display conditions, content recommendations and custom form
  fields. Controls only appear where the option actually applies, which keeps you away
  from the combinations that throw - `footerText` on a bar, a `position` on a gate, a
  `pushDown` on a bar that is not top-positioned.
- **Config** is the generated JavaScript, editable by hand. It is the same shape as the
  examples in `docs/docs/examples/src`, so a snippet from a bug report can be pasted in
  and run as-is. Switching back to Form regenerates the config from the controls.

Two things it handles that are easy to get wrong by hand:

- It sets `window.PathforaCSS` to `/dist/pathfora.min.css` before loading the SDK. The
  SDK otherwise injects the CDN stylesheet, and that production CSS wins the cascade
  over your local build - so local CSS changes appear to do nothing, with no error.
- It clears pathfora's stored state before each render. `pathfora.clearAll()` only
  resets in-memory trackers, so without this a submitted gate stays unlocked and
  impression caps stay spent, across renders *and* across reloads. Tick **Keep stored
  state** when you are deliberately testing impressions or `hideAfterAction`.

**Lytics tag** in the toolbar swaps the stubs for the real tag, against the same demo
account the published docs examples use. It is off by default so the playground stays
network-free for anyone just checking a layout. With it on:

- Audience targeting works - the **Audience** section targets a segment, matched against
  the visitor's own memberships. The suggestions are the demo account's Lytics managed
  audiences, hardcoded in `playground/fields.js` so that reading them live does not mean
  storing an API key; any other slug can be typed in. An exclude subtracts from that
  match, which is the only thing exclusions do: `initTargetedWidgets` filters the widgets
  a target already matched, so an exclude on its own is a no-op.
- Content recommendations call the recommendation API for real, with the `content`
  default document as the fallback. Without the tag there is no account to call, so the
  default is all you see. Either way `setupWidgetContentUnit` needs both `recommend` and
  `content` set, so a default document on its own renders nothing.

The tag is configured with `publish` and `preview` disabled, which stops the demo
account's own campaigns rendering on top of the widget under test and, as a side effect,
stops the tag installing its own SDK - so the local `dist/` build stays in charge.

`SiteGate` is deliberately absent: it is deprecated, and its confirm button is dead code
because `construct-widget-actions.js` never assigns it a `widgetAction`. Use `Form` with
layout `gate` instead.

### Testing

Pathfora uses [Jasmine](https://github.com/jasmine/jasmine) as a test framework, and [Karma](https://github.com/karma-runner/karma/) to run tests. Before running tests, or commiting changes be sure to run `gulp build` instead of `gulp local`, or tests may fail due to mismatching URLs.

Running tests:

```sh
$ yarn run test
```

## License

[MIT](LICENSE.md)
Copyright (c) 2017, 2016, 2015 Lytics
