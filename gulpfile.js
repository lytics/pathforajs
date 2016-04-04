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
var handlebars = require('gulp-compile-handlebars');
var config = require('./src/examples/config.json');
var fs = require('fs');
var through = require('through');
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


function outputHtml(extend, name, pathy) {
  pathy.push(name);
  extend["crumbs"] = pathy.join(" > ");
  extend["id"] = pathy.join("-");
  pathy.pop();
  gulp.src('src/examples/tpl.hbs')
    .pipe(data(function(){
      return extend;
    }))
    .pipe(handlebars({}))
    .pipe(rename(name + '.html'))
    .pipe(gulp.dest("examples/" + pathy.join("/")));
    //console.log("examples/" + pathy.join("/") + "/" + name + ".html");
    //console.log(options);
}

function copyObject(obj){
  var n = {};
  for(var field in obj) {
    n[field] = obj[field];
  }
  return n;
}

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function checkConfig(extendtemp, sub, lookup, arr, pathy) {
  arr.forEach(function(fin) {
    var extend = copyObject(extendtemp);
    var contents = fs.readFileSync("src/examples/" + sub + "/templates/" + lookup + ".hbs", "utf8");
    var templateSpec = handlebars.Handlebars.compile(contents);
    extend[lookup] = fin;
    extend["output"] = templateSpec(extend);

    outputHtml(extend, lookup + "-" + fin, pathy)
  });
}


gulp.task('build:hbs', function () {

  for (var type in config.type) {
    for (var sub in config.type[type]) {

      config.type[type][sub].forEach(function(val) {
        if (sub === "layout") {
          var ty = type;
          gulp.src('src/examples/layout/' + val + '/**/*.js')
          .pipe(through(function(file){
            var contents = fs.readFileSync(file.path, "utf8");
            var name = path.basename(file.path, ".js");
            outputHtml({layout: val, type: ty, output: contents}, name, [ty, val]);
          }));

          for(var lookup in config.layout[val]) {
            checkConfig({"layout": val, type: type}, sub, lookup, config.layout[val][lookup], [type, val]);
          }
        } else {
          checkConfig({type: type}, "type", sub, config.type[type][sub], [type]);
        }
      });
    }
  }

  for (other in config.other) {
    for (sub in config.other[other]) {
      checkConfig({layout: "modal", type: "Message"}, "other", sub, config.other[other][sub], [sub]);
    }
  }

  gulp.src(['src/examples/other/**/*.js', 'src/examples/types/**/*.js'])
  .pipe(through(function(file) {
    var type = "Message";
    var layout = "modal";
    var contents = fs.readFileSync(file.path, "utf8");
    var name = path.basename(file.path, ".js");
    var p = path.relative(process.cwd(), file.path);

    var p2 = p.split(/src\/examples\/[^\/;]+\//).pop();
    p2 = p2.split("/");
    var dir = p2.slice(0, -1).join("/");

    if (p.indexOf("examples/layout") > -1) {
      layout = p2[0];
    }

    if (p.indexOf("examples/type") > -1) {
      type = p2[0];
    }

    outputHtml({layout: layout, type: type, output: contents}, name, [dir]);
  }));

});

gulp.task('test', ['build:styles', 'build:testjs']);
gulp.task('local', ['build:hbs', 'build:styles', 'local:js', 'preview', 'local:watch']);
gulp.task('build', ['build:hbs', 'build:styles', 'build:js']);
gulp.task('default', ['build', 'preview', 'watch']);
