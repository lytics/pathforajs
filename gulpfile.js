var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var env = require('gulp-env');
var connect = require('gulp-connect');
var handlebars = require('gulp-compile-handlebars');
var through = require('through');
var fs = require('fs');
var walk = require('walk');
var APIURL;
var CSSURL;

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

gulp.task('build:js', function () {
  gulp.src('src/*.js')
    .pipe(replace('{{apiurl}}', '//api.lytics.io'))
    .pipe(replace('{{cssurl}}', '//c.lytics.io/static/pathfora.min.css'))
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
  gulp.watch('src/**/*', ['build:styles', 'local:js']);
});

gulp.task('preview', function () {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true
  });
});

gulp.task('build:hbs', function () {
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

gulp.task('test', ['build:styles', 'build:testjs']);
gulp.task('local', ['build:styles', 'local:js', 'build:hbs', 'preview', 'local:watch']);
gulp.task('build', ['build:styles', 'build:js', 'build:hbs']);
gulp.task('default', ['build', 'preview', 'watch']);
