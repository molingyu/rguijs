/**
 * Created by shitake on 16-12-8.
 */

var gp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var files = ['./src/*.js', './src/box/*.js', './src/controls/*.js'];

gp.task("mini", function () {
  gp.src(files)
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(concat('rgui.min.js'))
    .pipe(uglify({mangle: {except: ['require' ,'exports' ,'module' ,'$']}}))
    .pipe(gp.dest('./lib/'))
});

gp.task("build",function(){
  gp.src(files)
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(concat('rgui.js'))
    .pipe(gp.dest('./lib/'));
  gp.run('mini')
});

