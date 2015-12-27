var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('build:styles', function () {
  gulp.src('src/less/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'less', 'includes')
      ]
    }))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('build:js', function () {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['default']);
});

gulp.task('preview', function () {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true
  });
});

gulp.task('default', ['build:styles', 'build:js', 'preview']);
