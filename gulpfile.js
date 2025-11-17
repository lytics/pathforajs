'use strict';

const gulp = require('gulp'),
  less = require('gulp-less'),
  path = require('path'),
  terser = require('gulp-terser'),
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
  gutil = require('gulp-util');

let TESTAPIURL = 'https://c.lytics.io',
  TESTCSSURL = 'https://c.lytics.io/static/pathfora.min.css',
  EXAMPLESSRC = 'docs/docs/examples/src',
  EXAMPLESDEST = 'docs/docs/examples/preview',
  APIURL = 'https://c.lytics.io',
  CSSURL = 'https://c.lytics.io/static/pathfora.min.css',
  LOCALCSSURL = './dist/pathfora.min.css';

if (process.env.NODE_ENV !== 'production') {
  try {
    env({
      file: '.env.json',
    });
    APIURL = process.env.APIURL || 'https://c.lytics.io';
    CSSURL =
      process.env.CSSURL || 'https://c.lytics.io/static/pathfora.min.css';
  } catch (error) {
    APIURL = 'https://c.lytics.io';
    CSSURL = 'https://c.lytics.io/static/pathfora.min.css';
  }
}

gulp.task('build:styles', function () {
  return gulp
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

//Plugins for rollup. Babel, etc.
let rollupPlugins = [];

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
gulp.task(
  'build:js',
  gulp.series('build:rollup', function () {
    return gulp
      .src('dist/pathfora.js')
      .pipe(replace('`{{apiurl}}`', 'https://c.lytics.io'))
      .pipe(replace('`{{cssurl}}`', CSSURL))
      .pipe(replace('`{{templates}}`', prepareTemplates()))
      .pipe(gulp.dest('dist'))
      .pipe(terser().on('error', gutil.log))
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
  })
);

gulp.task(
  'local:js',
  gulp.series('build:rollup', function () {
    return gulp
      .src('dist/pathfora.js')
      .pipe(replace('`{{apiurl}}`', APIURL))
      .pipe(replace('`{{cssurl}}`', LOCALCSSURL))
      .pipe(replace('`{{templates}}`', prepareTemplates()))
      .pipe(gulp.dest('dist'))
      .pipe(terser().on('error', gutil.log))
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
  })
);

gulp.task(
  'build:testjs',
  gulp.series('build:rollup', function () {
    return gulp
      .src('dist/pathfora.js')
      .pipe(replace('`{{apiurl}}`', TESTAPIURL))
      .pipe(replace('`{{cssurl}`}', TESTCSSURL))
      .pipe(replace('`{{templates}}`', prepareTemplates()))
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
  })
);

gulp.task('watch', function () {
  return gulp.watch(
    'src/**/*',
    gulp.series('build:styles', 'build:rollup', 'build:js')
  );
});

gulp.task('local:watch', function () {
  return gulp.watch('src/**/*', gulp.series('build:local'));
});

gulp.task('preview', function (done) {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true,
  });
  done();
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

gulp.task(
  'docs:watch',
  gulp.series('build:rollup', function () {
    return gulp.watch('docs/docs/examples/src/**/*', function (done) {
      compileExample('.', '.');
      done();
    });
  })
);

gulp.task(
  'docs:hbs',
  gulp.series('build:rollup', function (done) {
    let options = {
      listeners: {
        file: function (root, stat) {
          compileExample(root, stat.name);
        },
      },
    };

    walk.walkSync(EXAMPLESSRC, options);
    done();
  })
);

gulp.task(
  'docs:mkdocs',
  gulp.series(
    'build:rollup',
    shell.task(['mkdocs serve'], {
      cwd: 'docs',
    })
  )
);

gulp.task(
  'lint',
  gulp.series('build:js', function () {
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
  })
);

gulp.task('test', gulp.parallel('build:styles', 'build:testjs'));
gulp.task('build:local', gulp.parallel('build:styles', 'local:js'));
gulp.task('build:docs', gulp.parallel('docs:hbs', 'docs:mkdocs'));
gulp.task(
  'build',
  gulp.series(gulp.parallel('build:styles', 'build:js'), 'lint')
);
gulp.task(
  'local',
  gulp.series('build:local', gulp.parallel('preview', 'local:watch'))
);
gulp.task(
  'docs',
  gulp.series(
    'build:local',
    'build:docs',
    gulp.parallel('preview', 'docs:watch')
  )
);
gulp.task('default', gulp.series('build', gulp.parallel('preview', 'watch')));
