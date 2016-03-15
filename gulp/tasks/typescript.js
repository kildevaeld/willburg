"use strict";

const gulp = require('gulp'),
  tsc = require('gulp-typescript'),
  babel = require('gulp-babel'),,
  merge = require('merge2');


const project = tsc.createProject('tsconfig.json');

gulp.task('typescript', () => {

  let result = project.src()
  .pipe(tsc(project))

  let js = result.js
  .pipe(babel({
    presets: ['es2015-without-regenerator']
  }))

  return merge([
    js.pipe(gulp.dest('lib')),
    results.dts.pipe(gulp.dest('lib'));
    ]);

});

gulp.task('watch:typescript', () => {
  return gulp.watch('src/**/*.ts', ['typescript']);
})