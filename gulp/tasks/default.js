"use strict";

const gulp = require('gulp'),
    bump = require('gulp-bump');

gulp.task('default', ['typescript'])

gulp.task('bump', () => {
    gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'))
})