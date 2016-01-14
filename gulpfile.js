'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var del = require('del');

require('babel-core/register');

var src = [
  'src/shady-css/common.js',
  'src/shady-css/node-factory.js',
  'src/shady-css/node-visitor.js',
  'src/shady-css/stringifier.js',
  'src/shady-css/token.js',
  'src/shady-css/tokenizer.js',
  'src/shady-css/parser.js',
  'src/*.js'
];
var dest = 'dist/';

gulp.task('default', ['clean', 'test', 'build', 'minify', 'measure']);

gulp.task('build', ['test'], function() {
  return gulp.src(src)
    .pipe(babel())
    .on('error', function(error) {
      console.error(error);
    })
    .pipe(concat('shady-css.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('minify', ['build'], function() {
  return gulp.src('dist/shady-css.js')
    .pipe(uglify())
    .on('error', function(error) {
      console.error(error);
    })
    .pipe(rename('shady-css.min.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('measure', ['minify'], function() {
  return gulp.src('dist/*.js')
    .pipe(size({
      showFiles: true
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
});

gulp.task('test', function() {
  return gulp.src('test/*.js', {
    read: false
  }).pipe(mocha());
});

gulp.task('clean', function() {
  del.sync([dest]);
});

gulp.task('watch', function(done) {
  gulp.watch(src, ['default', 'minify', 'measure']);
});
