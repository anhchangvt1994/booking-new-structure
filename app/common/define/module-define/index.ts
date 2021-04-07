import { v4 as uuidv4 } from 'uuid';
import gulp = require('gulp');
import clean = require('gulp-clean');
import copy = require('gulp-copy');
import sass = require('gulp-sass');
import dartSass = require('gulp-dart-sass');

//-- sub dependencies
import plumber = require('gulp-plumber');
import cached = require('gulp-cached');
import ansiColors = require('ansi-colors');
import dependents = require('gulp-dependents');
let print = require('gulp-print');
let browserSync = require('browser-sync');
import prettier = require('gulp-prettier');
import tap = require('gulp-tap');
import babel = require('gulp-babel');
import gulpBrowserify = require('gulp-browserify');
import browserify = require('browserify');
import babelify = require('babelify');
import vueify = require('vueify');
import source = require('vinyl-source-stream');
import rename = require('gulp-rename');
import buffer = require('vinyl-buffer');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import data = require('gulp-data');
import nunjucksRender = require('gulp-nunjucks-render');
import del = require('del');
import path = require('path');
import fs = require('fs');
import imageMin = require('gulp-imagemin');
import sassVars = require('gulp-sass-variables');
import eslint = require('gulp-eslint');
import util = require('gulp-util');

print = print.default;
browserSync = browserSync.create();

export {
  gulp,
  clean,
  sass,
  dartSass,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  dependents,
  print,
  browserSync,
  prettier,
  tap,
  babel,
  gulpBrowserify,
  browserify,
  babelify,
  vueify,
  source,
  rename,
  buffer,
  uglify,
  cleanCss,
  data,
  nunjucksRender,
  del,
  path,
  fs,
  imageMin,
  sassVars,
  uuidv4,
  eslint,
  util,
};

export default {
  gulp,
  clean,
  sass,
  dartSass,
  copy,

  // sub dependencies
  plumber,
  ansiColors,
  cached,
  dependents,
  print,
  browserSync,
  prettier,
  tap,
  babel,
  gulpBrowserify,
  browserify,
  babelify,
  vueify,
  source,
  rename,
  buffer,
  uglify,
  cleanCss,
  data,
  nunjucksRender,
  del,
  path,
  fs,
  imageMin,
  sassVars,
  uuidv4,
  eslint,
  util,
}
