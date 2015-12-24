/** @jsx React.DOM */
var gulp = require('gulp');
//var browserify = require('gulp-browserify'); // NOTE Unused
//var concat = require('gulp-concat'); // NOTE Unused
//var connect = require('gulp-connect'); // NOTE Unused
//var open = require('gulp-open'); // NOTE Unused
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var os = require('os');

// NOTE Unused
//gulp.task('copy', function () {
//  gulp.src('src/*')
//    .pipe(gulp.dest('dist'));
//});

var tmpDirCss = path.join(os.tmpdir(), 'css');

gulp.task('less', function () {
  var tmpdir = os.tmpdir();
  
  gulp.src('src/less/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'less', 'includes')
      ]
    }))
    .pipe(gulp.dest(tmpDirCss));
});

gulp.task('styles', ['less'], function () {
  gulp.src(path.join(tmpDirCss, '/*.css'))
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

gulp.task('default', ['styles', 'minify']);
