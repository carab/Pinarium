'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('manifest', function() {
  gulp.src([path.join(conf.paths.dist, '/**')], { base: './' })
    .pipe($.manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'manifest.appcache',
      exclude: 'manifest.appcache'
     }))
    .pipe(gulp.dest(conf.paths.dist));
});
