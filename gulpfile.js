/** @jsx React.DOM */
var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulp = require('gulp'),
    open = require('gulp-open'),
    less = require('gulp-less'),
    path = require('path');

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
        .pipe(gulp.dest('./dist/css'));
  })

  // build the application
  .task('default', ['less', 'copy'])

  // watch for source changes
  .task('watch', function(){
    gulp.watch('src/**/*.*', ['default']);
  });