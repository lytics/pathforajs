var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    minify = require('html-minifier').minify,
    env = require('gulp-env'),
    connect = require('gulp-connect'),
    walk    = require('walk'),
    fs = require("fs"),
    handlebars = require('gulp-compile-handlebars'),
    shell = require('gulp-shell'),
    APIURL,
    CSSURL;


// get overrides from .env file
try {
  env({
      file: '.env.json',
  });
  APIURL = process.env.APIURL || "//api.lytics.io";
  CSSURL = process.env.CSSURL || "//c.lytics.io/static/pathfora.min.css";
} catch (error) {
  APIURL = "//api.lytics.io";
  CSSURL = "//c.lytics.io/static/pathfora.min.css";
}

var TESTAPIURL = "//api.lytics.io";
var TESTCSSURL = "//c.lytics.io/static/pathfora.min.css";

gulp.task('build:styles', function () {
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
  var templateDirectory = "src/templates",
      templates = {},
      options = {};

  options = {
    listeners: {
      file: function (root, stat, next) {
        var dir = root.split("/").pop();

        if(!templates[dir]){
          templates[dir] = {};
        }

        if ( stat.name.charAt( 0 ) !== '.' ) {
          var markup = fs.readFileSync(root + '/' + stat.name, "utf-8")
          var file = stat.name.replace(".html", "");
          templates[dir][file] = minify(markup, {collapseWhitespace: true, preserveLineBreaks: false });
        }
      }
    }
  };

  walker = walk.walkSync(templateDirectory, options);
  return JSON.stringify(templates, null, 2);
};

gulp.task('build:js', function () {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', '//api.lytics.io'))
    .pipe(replace('{{cssurl}}', '//c.lytics.io/static/pathfora.min.css'))
    .pipe(replace('{{templates}}', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('local:js', function () {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', APIURL))
    .pipe(replace('{{cssurl}}', CSSURL))
    .pipe(replace('{{templates}}', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('build:testjs', function () {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', TESTAPIURL))
    .pipe(replace('{{cssurl}}', TESTCSSURL))
    .pipe(replace('{{templates}}', prepareTemplates()))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['build']);
});

gulp.task('local:watch', function () {
  gulp.watch('src/**/*', ['build:local']);
});

gulp.task('docs:watch', function () {
  gulp.watch('docs/docs/examples/src/**/*.js', ['build:docs']);
});

gulp.task('preview', function () {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true
  });
});

gulp.task('docs:hbs', function () {
  var basedir = "docs/docs/examples/src",
      destdir = "docs/docs/examples/preview",
      options = {
        listeners: {
          file: function (root, stat, next) {
            if (stat.name.split('.').pop() === "js") {
              var contents = {config: fs.readFileSync(root + '/' + stat.name, "utf8")};
              var dest = root.split(basedir + '/').pop();

              gulp.src(basedir + '/template.hbs')
                .pipe(handlebars(contents))
                .pipe(rename(stat.name.replace(".js", ".html")))
                .pipe(gulp.dest(destdir + "/" +  dest));
            }
          }
        }
      };

  walk.walkSync(basedir, options);
});

gulp.task('docs:mkdocs', shell.task([
  'mkdocs serve'
], {
  cwd: 'docs'
}))

gulp.task('test', ['build:styles', 'build:testjs']);
gulp.task('build:local', ['build:styles', 'local:js']);
gulp.task('build:docs', ['docs:hbs', 'docs:mkdocs'])
gulp.task('build', ['build:styles', 'build:js']);
gulp.task('local', ['build:local', 'preview', 'local:watch']);
gulp.task('docs', ['build:local', 'build:docs', 'preview', 'docs:watch']);
gulp.task('default', ['build', 'preview', 'watch']);
