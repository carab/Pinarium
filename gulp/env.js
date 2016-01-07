'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('translations', function() {
  return gulp.src(path.join(conf.paths.src, '/app/languages/*.json'))
    .pipe($.angularTranslate({
      standalone: false,
      module: 'vinarium',
      filename: 'index.translations.js'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
});
