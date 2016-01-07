'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('deploy:development', ['build:development'], function () {
  gulp.start($.shell.task([
    getFirebaseCommand('development')
  ]));
});

gulp.task('deploy:production', ['build'], function () {
  gulp.start($.shell.task([
    getFirebaseCommand('production')
  ]));
});

function getFirebaseCommand(env) {
  return 'firebase deploy -f ' + getFirebaseName(env);
}

function getFirebaseName(env) {
  var config = require('../src/app/index.env.json');
  return config[env].FirebaseConfig.app;
}
