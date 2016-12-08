/**
 * Created by shitake on 16-12-8.
 */

let gp = require('gulp');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');

let files = ['./src/*.js', './src/box/*.js', './src/controls/*.js'];

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
    .pipe(concat('index.js'))
    .pipe(gp.dest('./lib/'));
  gp.run('mini')
});

