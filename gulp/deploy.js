'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('deploy:development', ['build:development'], $.shell.task([
  'firebase deploy -f ' + getFirebaseName('development')
]));

gulp.task('deploy:production', ['build'], $.shell.task([
  'firebase deploy -f ' + getFirebaseName('production')
]));

function getFirebaseName(env) {
  var config = require('../src/app/index.env.json');
  return config[env].FirebaseConfig.app;
}
