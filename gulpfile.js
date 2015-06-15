/** @jsx React.DOM */
var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    open = require('gulp-open'),
    less = require('gulp-less'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

gulp
  // moves source files to dist
  .task('copy', function(){

     gulp
      .src('src/*.*')
      .pipe(gulp.dest('dist'));
  })

  .task('less', function () {
    return gulp.src(['./src/less/pathfora.less'])
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./src/css'));
  })

  .task('compress', function() {
        return gulp.src('src/*.js')
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dist'));
    })

  // build the application
  .task('default', ['css', 'compress'])

  // watch for source changes
  .task('watch', function(){
    gulp.watch('src/**/*.*', ['default']);
  })

  .task('css', ['less'], function () {
        return gulp.src('./src/css/*.css')
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('dist'))
  });