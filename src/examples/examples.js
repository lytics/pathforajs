var gulp = require('gulp');
var extend = require('extend');
var fs = require('fs');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');

function example(path, name, type, layout) {
  this.path = path;
  this.name = name || "";
  this.data = {
    type: type || "Message",
    layout: layout || "modal"
  };
}

example.prototype.configure = function(category, arr) {
  var ex = this;
  arr.forEach(function(fin) {
    var exCopy = {};
    extend(true, exCopy, ex);
    var contents = fs.readFileSync("src/examples/" + category + "/templates/" + exCopy.name + ".hbs", "utf8");
    var templateSpec = handlebars.Handlebars.compile(contents);
    exCopy.data[exCopy.name] = fin;
    exCopy.data.output = templateSpec(exCopy.data);
    exCopy.name += "-" + fin;
    exCopy.output();
  });
}

example.prototype.output = function() {
  this.path.push(this.name);
  this.data.crumbs = this.path.join(" > ");
  this.data.id = this.path.join("-");
  this.path.pop();
  gulp.src('src/examples/tpl.hbs')
    .pipe(handlebars(this.data))
    .pipe(rename(this.name + '.html'))
    .pipe(gulp.dest("examples/" + this.path.join("/")));
}

module.exports = example;