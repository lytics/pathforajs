Pathfora JS is a lightweight SDK for displaying personalized modules on your website. it integrates with your [Lytics](http://www.getlytics.com/) account to track user actions, and conditionally display modules based on your users' audience memebership. This documentation will walk you through everything you need to create your own highly customized and personalized module. Code and live preview examples are provided along the way.

## Getting Started
Before you begin creating modules with Pathfora you must have add the [Lytics Javascript Tag](https://activate.getlytics.com/#/documentation/jstag_anon) to your website. The Pathfora tag must be loaded after the Lytics tag.

``` html
<!-- Your Lytics JS Tag -->
<script src="https://api.lytics.io/api/tag/{{YOUR LYTICS API KEY}}/lio.js"></script>

<!-- Pathfora Tag -->
<script src="http://c.lytics.io/static/pathfora.min.js"></script>
```

Next you'll need to set up configuration for your module and initialize it with `pathfora.initializeWidgets` example configurations, what all these settings mean, and their outputted modules can be found throughout the documentation.

## Overview
Here are a couple sections to get you started on the basics of Pathfora JS. See the navigation in the sidebar for a full list of docs.

- **[Types](types/message.md)** 
> The type parameter relays information to the layout (see below) related to the type of content being rendered. Pathfora currently supports four types of modules: message, form, subscription and gate.

- **[Layouts](layouts/modal.md)**
> The layout controls the style (what does the module look like & how does it animate into view). Pathfora currently supports four different layouts for each of the types: modal, slideout, bar, and button.

- **[Audience Targeting](targeting.md)**
> This section will walk you through how to make your modules truely personalized by targeting them to a specific subset of your users as defined by your Lytics audiences.

- **[Display Conditions](display_conditions.md)**
> Display conditions can control when the module is displayed based on the current date, previous actions of the user, current scroll position on the page, and many more settings.

- **[Customization](customization/themes.md)** 
> Here we cover a few of the options for basic to full customization of the settings such as button and field names, color themes, look and feel.



## Development

Pathfora uses [NPM](https://docs.npmjs.com/) for package management, and [Gulp](https://github.com/gulpjs/gulp) to manage build tasks.

### Install Dependencies

```sh
$ npm install --global gulp-cli
$ npm install
```

### Gulp tasks

**`gulp build`**
> Minify LESS files and uglify js files in the src directory, and place output in dist directory.

**`gulp`**
> Runs the `build` tasks above and watches for any changes in the src directory, files are served on localhost port 8080

**`gulp local`**
> Reads some config params from an optional local file, `.env.json` and builds and watches as with the default gulp task. This can allow you to test CSS changes locally (by default `dist/pathfora.min.js` loads the most recently deployed CSS file) or override the Lytics API URL

Example `.env.json` file, (using local CSS):

```json
{
  "APIURL": "https://api.lytics.io",
  "CSSURL": "http://localhost:8080/dist/pathfora.min.css"
}
```

### Testing
Pathfora uses [Jasmine](https://github.com/jasmine/jasmine) as a test framework, and [Karma](https://github.com/karma-runner/karma/) to run tests. Before running tests, or commiting changes be sure to run `gulp build` instead of `gulp local`, or tests will fail due to mismatching URLs.

Running Tests:
``` sh
$ gulp build && karma start --single-run --browsers PhantomJS
```