"use strict";

const gulp = require('gulp'),
  tsc = require('gulp-typescript'),
  babel = require('gulp-babel'),
  merge = require('merge2');

const config = require('../config');
const project = tsc.createProject('tsconfig.json');

gulp.task('typescript', () => {

  let result = project.src()
  .pipe(tsc(project))

  let js = result.js
  .pipe(babel({
    //presets: ['es2015-without-regenerator'],
    plugins: config.babel
  }))

  return merge([
    js.pipe(gulp.dest('lib')),
    result.dts.pipe(gulp.dest('lib'))
    ]);

});

gulp.task('watch:typescript', () => {
  return gulp.watch('src/**/*.ts', ['typescript']);
});

var fs = require('fs');
var readdir = require('recursive-readdir');


gulp.task('addfiles', (done) => {
  var tsconfig = require(process.cwd() + '/tsconfig.json');
  readdir(process.cwd() + '/src', function (e, files) {
    if (e) return done(e);
    tsconfig.files = files.filter(function (file) {
      var len = file.length
      return file.substr(len - 3) === '.ts' && file.substr(len - 5) !== ".d.ts";
    }).map(function (file) {
      return file.replace(process.cwd() +'/', '')
    });

    tsconfig.files.unshift('typings/index.d.ts')

    fs.writeFile('./tsconfig.json', JSON.stringify(tsconfig,null,2), function () {
      console.log('%s files added',tsconfig.files.length);
      done();
    });
  })
});