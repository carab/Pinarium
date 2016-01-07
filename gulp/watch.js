'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['env:development', 'inject'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.scss')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch([
    path.join(conf.paths.src, '/app/*.json')
  ], function(event) {
    gulp.start('env:development');
  });

  gulp.watch([
    path.join(conf.paths.src, '/app/languages/*.json')
  ], function(event) {
    gulp.start('translations');
  });

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join(conf.paths.tmp, '/serve/**/*.js')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('scripts-reload');
    } else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
