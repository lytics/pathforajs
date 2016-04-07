var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var env = require('gulp-env');
var connect = require('gulp-connect');
var data = require('gulp-data');
var config = require('./src/examples/config.json');
var fs = require('fs');
var through = require('through');
var example = require('./src/examples/examples.js');
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
  gulp.watch('src/**/*', ['local']);
});

gulp.task('preview', function () {
  connect.server({
    port: 8080,
    root: '.',
    livereload: true
  });
});



gulp.task('hbs:config', function () {
  for (var type in config.type) {
    for (var category in config.type[type]) {
      config.type[type][category].forEach(function(val) {
        if (category === "layout") {
          var ex = new example([type, val], "", type, val);

          gulp.src('src/examples/layout/' + val + '/**/*.js')
          .pipe(through(function(file){
            ex.name = path.basename(file.path, ".js");
            ex.data.output = fs.readFileSync(file.path, "utf8");
            ex.output();
          }));

          for(var name in config.layout[val]) {
            ex.name = name;
            ex.configure(category, config.layout[val][name]);
          }
        } else {
          var ex = new example([type], category, type);
          ex.configure("type", config.type[type][category]);
        }
      });
    }
  }

  for (other in config.other) {
    for (category in config.other[other]) {
      var ex = new example([category], category);
      ex.configure("other", config.other[other][category]);
    }
  }
});


gulp.task('hbs:examples', function () {
  gulp.src(['src/examples/other/**/*.js', 'src/examples/type/**/*.js'])
  .pipe(through(function(file) {
    var p = path.relative(process.cwd(), file.path);
    var p2 = p.split(/src\/examples\/[^\/;]+\//).pop();
    p2 = p2.split("/");
    var dir = p2.slice(0, -1).join("/");

    var ex = new example([dir], path.basename(file.path, ".js"));
    ex.data.output = fs.readFileSync(file.path, "utf8");

    if (p.indexOf("examples/layout") > -1)
      ex.data.layout = p2[0];

    if (p.indexOf("examples/type") > -1)
      ex.data.type = p2[0];

    ex.output();
  }));
});


gulp.task('hbs', ['hbs:config', 'hbs:examples']);
gulp.task('test', ['build:styles', 'build:testjs']);
gulp.task('local', ['hbs', 'build:styles', 'local:js', 'preview', 'local:watch']);
gulp.task('build', ['hbs', 'build:styles', 'build:js']);
gulp.task('default', ['build', 'preview', 'watch']);
