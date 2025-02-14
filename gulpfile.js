'use strict';

const gulp = require('gulp'),
  less = require('gulp-less'),
  path = require('path'),
  uglify = require('gulp-uglify'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  minify = require('html-minifier').minify,
  env = require('gulp-env'),
  connect = require('gulp-connect'),
  walk = require('walk'),
  fs = require('fs'),
  handlebars = require('gulp-compile-handlebars'),
  shell = require('gulp-shell'),
  rollup = require('rollup'),
  eslint = require('gulp-eslint'),
  gutil = require('gulp-util'),
  istanbul = require('rollup-plugin-istanbul');

let TESTAPIURL = '//c.lytics.io',
  TESTCSSURL = '//c.lytics.io/static/pathfora.min.css',
  EXAMPLESSRC = 'docs/docs/examples/src',
  EXAMPLESDEST = 'docs/docs/examples/preview',
  APIURL,
  CSSURL;

// get overrides from .env file
try {
  env({
    file: '.env.json',
  });
  APIURL = process.env.APIURL || 'https://c.lytics.io';
  CSSURL = process.env.CSSURL || 'https://c.lytics.io/static/pathfora.min.css';
} catch (error) {
  APIURL = 'https://c.lytics.io';
  CSSURL = 'https://c.lytics.io/static/pathfora.min.css';
}

gulp.task('build:styles', function () {
  gulp
    .src('src/less/*.less')
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'includes')],
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(cssmin())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

// gathers and minifies all the widget templates for inclusion
const prepareTemplates = function () {
  let templateDirectory = 'src/templates',
    templates = {},
    includes = {};

  let options = {
    listeners: {
      file: function (root, stat) {
        if (stat.name === '.DS_Store') {
          return;
        }

        let dir = root.split('/').pop();

        if (!templates[dir]) {
          templates[dir] = {};
        }

        if (stat.name.charAt(0) !== '.') {
          let markup = fs.readFileSync(root + '/' + stat.name, 'utf-8'),
            file = stat.name.replace('.html', '');

          if (dir === 'includes') {
            includes[file] = minify(markup, {
              collapseWhitespace: true,
              preserveLineBreaks: false,
            });
          } else {
            templates[dir][file] = minify(markup, {
              collapseWhitespace: true,
              preserveLineBreaks: false,
            });
          }
        }
      },
    },
  };

  walk.walkSync(templateDirectory, options);
  let str = JSON.stringify(templates, null, 2);

  for (let inc in includes) {
    if (includes.hasOwnProperty(inc)) {
      str = str.replace(
        new RegExp('({){2}' + inc + '(}){2}', 'gm'),
        includes[inc].replace(/"/g, '\\"')
      );
    }
  }

  return str.replace(/\"/g, "'");
};

//Plugins for rollup. Babel, istanbul, etc.
let rollupPlugins = [];

if (process.env.NODE_ENV !== 'production') {
  rollupPlugins.push(
    istanbul({
      exclude: ['test/*.spec.js', 'dist/*.js'],
    })
  );
}

gulp.task('build:rollup', async function () {
  const bundle = await rollup.rollup({
    input: 'src/rollup/pathfora.js',
    plugins: rollupPlugins,
  });

  await bundle.write({
    format: 'iife',
    name: 'pathfora',
    file: 'dist/pathfora.js',
  });
});

// Ensure build:rollup finishes before running build:js
// by adding it as a dependent job
gulp.task('build:js', ['build:rollup'], function () {
  gulp
    .src('dist/pathfora.js')
    .pipe(replace('`{{apiurl}}`', 'https://c.lytics.io'))
    .pipe(
      replace('`{{cssurl}}`', 'https://c.lytics.io/static/pathfora.min.css')
    )
    .pipe(replace('`{{templates}}`', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('local:js', ['build:rollup'], function () {
  gulp
    .src('dist/pathfora.js')
    .pipe(replace('`{{apiurl}}`', APIURL))
    .pipe(replace('`{{cssurl}}`', CSSURL))
    .pipe(replace('`{{templates}}`', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('build:testjs', ['build:rollup'], function () {
  gulp
    .src('dist/pathfora.js')
    .pipe(replace('`{{apiurl}}`', TESTAPIURL))
    .pipe(replace('`{{cssurl}`}', TESTCSSURL))
    .pipe(replace('`{{templates}}`', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['build:styles', 'build:rollup', 'build:js']);
});

gulp.task('local:watch', function () {
  gulp.watch('src/**/*', ['build:local']);
});

gulp.task('preview', function () {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true,
  });
});

const compileExample = function (root, name) {
  let out,
    css,
    proc,
    html,
    dest = root.split(EXAMPLESSRC + '/').pop(),
    contents = {
      config: '',
      css: '',
      html: '',
    };

  switch (name.split('.').pop()) {
    case 'js':
      contents.config = fs.readFileSync(root + '/' + name, 'utf8');
      css = root + '/' + name.replace('.js', '.css');
      html = root + '/' + name.replace('.js', '.html');
      out = name.replace('.js', '.html');
      proc = true;
      break;

    default:
      proc = false;
      break;
  }

  if (proc) {
    try {
      fs.statSync(css);
      contents.css = fs.readFileSync(css, 'utf8');
    } catch (err) {
      // do nothing
    }

    try {
      fs.statSync(html);
      contents.html = fs.readFileSync(html, 'utf8');
    } catch (err) {
      // do nothing
    }

    gulp
      .src(EXAMPLESSRC + '/template.hbs')
      .pipe(handlebars(contents))
      .pipe(rename(out))
      .pipe(gulp.dest(EXAMPLESDEST + '/' + dest));
  }
};

gulp.task('docs:watch', ['build:rollup'], function () {
  gulp.watch('docs/docs/examples/src/**/*', function (event) {
    let p = path.relative(process.cwd(), event.path);
    let root = p.substring(0, p.lastIndexOf('/') + 1);
    let name = p.substring(p.lastIndexOf('/') + 1, p.length);
    compileExample(root, name);
  });
});

gulp.task('docs:hbs', ['build:rollup'], function () {
  let options = {
    listeners: {
      file: function (root, stat) {
        compileExample(root, stat.name);
      },
    },
  };

  walk.walkSync(EXAMPLESSRC, options);
});

gulp.task(
  'docs:mkdocs',
  ['build:rollup'],
  shell.task(['mkdocs serve'], {
    cwd: 'docs',
  })
);

gulp.task('lint', ['build:js'], function () {
  return gulp
    .src([
      'src/rollup/**/*.js',
      'gulpfile.js',
      'test/**/*.js',
      'docs/docs/examples/**/*.js',
    ])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['build:styles', 'build:rollup', 'build:testjs']);
gulp.task('build:local', ['build:styles', 'build:rollup', 'local:js']);
gulp.task('build:docs', ['docs:hbs', 'docs:mkdocs']);
gulp.task('build', ['build:styles', 'build:rollup', 'build:js', 'lint']);
gulp.task('local', ['build:local', 'preview', 'local:watch']);
gulp.task('docs', ['build:local', 'build:docs', 'preview', 'docs:watch']);
gulp.task('default', ['build', 'preview', 'watch']);
