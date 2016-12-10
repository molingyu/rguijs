/**
 * Created by shitake on 16-12-8.
 */

var gp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var spawn = require('child_process').spawn;

var files = ['./src/*.js', './src/controls/*.js'];

gp.task("mini", function () {
  gp.src(files)
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(concat('rgui.min.js'))
    .pipe(uglify({mangle: {except: ['require' ,'exports' ,'module' ,'$']}}))
    .pipe(gp.dest('./dist/'))
});

gp.task("start",function(){
  var start = spawn('electron', ['examples/index.js']);
  start.stdout.on('data', (data)=>{ console.log(data) });
  start.stderr.on('data', (data)=>{ console.log(data) })
});

gp.task("build-electron",function(){
  var buildElectron = spawn('electron', ['./node_modules/svent/node_modules/fibers/build']);
  buildElectron.stdout.on('data', (data)=>{ console.log(data) });
  buildElectron.stderr.on('data', (data)=>{ console.log(data) })
});

gp.task("build",function(){
  gp.src('./src/*.js')
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(gp.dest('./lib/'));
  gp.src('./src/controls/*.js')
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(gp.dest('./lib/controls/'));
});

