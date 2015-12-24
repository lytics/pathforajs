/** @jsx React.DOM */
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulp = require('gulp');
var open = require('gulp-open');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

gulp.task('copy', function () {
  gulp.src('src/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('less', function () {
  gulp.src('src/less/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'less', 'includes')
      ]
    }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('styles', ['less'] function () {
  gulp.src('src/css/*.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function () {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['default']);
});

gulp.task('default', ['css', 'minify']);
