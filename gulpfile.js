/* eslint-env node */
'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var minify = require('html-minifier').minify;
var env = require('gulp-env');
var connect = require('gulp-connect');
var walk = require('walk');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var series = require('gulp-sequence');
var TESTAPIURL = '//api.lytics.io';
var TESTCSSURL = '//c.lytics.io/static/pathfora.min.css';
var EXAMPLESSRC = 'docs/docs/examples/src';
var EXAMPLESDEST = 'docs/docs/examples/preview';
var APIURL, CSSURL;

// get overrides from .env file
try {
  env({
    file: '.env.json'
  });
  APIURL = process.env.APIURL || '//api.lytics.io';
  CSSURL = process.env.CSSURL || '//c.lytics.io/static/pathfora.min.css';
} catch (error) {
  APIURL = '//api.lytics.io';
  CSSURL = '//c.lytics.io/static/pathfora.min.css';
}

gulp.task('build:styles', function() {
  gulp.src('src/less/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'less', 'includes')
      ]
    }))
    .pipe(gulp.dest('dist'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

// gathers and minifies all the widget templates for inclusion
var prepareTemplates = function() {
  var templateDirectory = 'src/templates';
  var templates = {};
  var includes = {};
  var options = {};

  options = {
    listeners: {
      file: function(root, stat) {
        var dir = root.split('/').pop();

        if (!templates[dir]) {
          templates[dir] = {};
        }

        if (stat.name.charAt(0) !== '.') {
          var markup = fs.readFileSync(root + '/' + stat.name, 'utf-8');
          var file = stat.name.replace('.html', '');

          if (dir === 'includes') {
            includes[file] = minify(markup, { collapseWhitespace: true, preserveLineBreaks: false });
          } else {
            templates[dir][file] = minify(markup, { collapseWhitespace: true, preserveLineBreaks: false });
          }
        }
      }
    }
  };

  walk.walkSync(templateDirectory, options);
  var str = JSON.stringify(templates, null, 2);

  for (var inc in includes) {
    if (includes.hasOwnProperty(inc)) {
      str = str.replace(
        new RegExp('(\{){2}' + inc + '(\}){2}', 'gm'),
        includes[inc].replace(/"/g, '\\"')
      );
    }
  }

  return str.replace(/\"/g, '\'');
};

gulp.task('build:js', function() {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', '//api.lytics.io'))
    .pipe(replace('{{cssurl}}', '//c.lytics.io/static/pathfora.min.css'))
    .pipe(replace('\'{{templates}}\'', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('local:js', function() {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', APIURL))
    .pipe(replace('{{cssurl}}', CSSURL))
    .pipe(replace('{{templates}}', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('build:testjs', function() {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', TESTAPIURL))
    .pipe(replace('{{cssurl}}', TESTCSSURL))
    .pipe(replace('{{templates}}', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('src/**/*', [ 'build:styles', 'build:js' ]);
});

gulp.task('local:watch', function() {
  gulp.watch('src/**/*', [ 'build:local' ]);
});

gulp.task('preview', function() {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true
  });
});

var compileExample = function(root, name) {
  var out, css, proc;
  var dest = root.split(EXAMPLESSRC + '/').pop();
  var contents = {
    config: '',
    css: '',
    html: ''
  };

  switch (name.split('.').pop()) {
    case 'js':
      contents.config = fs.readFileSync(root + '/' + name, 'utf8');
      css = root + '/' + name.replace('.js', '.css');
      out = name.replace('.js', '.html');
      proc = true;
      break;

    case 'html':
      contents.html = fs.readFileSync(root + '/' + name, 'utf8');
      css = root + '/' + name.replace('.html', '.css');
      out = name;
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

    gulp.src(EXAMPLESSRC + '/template.hbs')
      .pipe(handlebars(contents))
      .pipe(rename(out))
      .pipe(gulp.dest(EXAMPLESDEST + '/' + dest));
  }
};

gulp.task('docs:watch', function() {
  gulp.watch('docs/docs/examples/src/**/*', function(event) {
    var p = path.relative(process.cwd(), event.path);
    var root = p.substring(0, p.lastIndexOf('/') + 1);
    var name = p.substring(p.lastIndexOf('/') + 1, p.length);
    compileExample(root, name);
  });
});

gulp.task('docs:hbs', function() {
  var options = {
    listeners: {
      file: function(root, stat) {
        compileExample(root, stat.name);
      }
    }
  };

  walk.walkSync(EXAMPLESSRC, options);
});

gulp.task('docs:mkdocs', shell.task([
  'mkdocs serve'
], {
  cwd: 'docs'
}));

gulp.task('lint', function() {
  return gulp.src([ 'dist/pathfora.js', 'gulpfile.js', 'test/pathforaSpec.js', 'docs/docs/examples/**/*.js' ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', [ 'build:styles', 'build:testjs' ]);
gulp.task('build:local', [ 'build:styles', 'local:js' ]);
gulp.task('build:docs', [ 'docs:hbs', 'docs:mkdocs' ]);
gulp.task('build', series([ 'build:styles', 'build:js' ], 'lint'));
gulp.task('local', [ 'build:local', 'preview', 'local:watch' ]);
gulp.task('docs', [ 'build:local', 'build:docs', 'preview', 'docs:watch' ]);
gulp.task('default', [ 'build', 'preview', 'watch' ]);
