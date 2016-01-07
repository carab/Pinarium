'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('env:development', function () {
  return gulp.src(path.join(conf.paths.src, '/app/index.env.json'))
    .pipe($.ngConfig('vinarium', {
      environment: 'development',
      createModule: false
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
});

gulp.task('env:production', function () {
  return gulp.src(path.join(conf.paths.src, '/app/index.env.json'))
    .pipe($.ngConfig('vinarium', {
      environment: 'production',
      createModule: false
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
});
