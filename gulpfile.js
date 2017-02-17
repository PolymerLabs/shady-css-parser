'use strict';
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var del = require('del');

const nodeTsProject = typescript.createProject('tsconfig.json');
const browserTsProject = typescript.createProject('tsconfig-concat.json');

var dist = 'dist';

var srcsAndTests = ['src/**/*.ts'];
var srcs = srcsAndTests.concat(['!src/test/**/*.ts']);

var measureable = [
  dist + '/shady-css.concat.js',
  dist + '/shady-css.min.js'
];

gulp.task('default', ['clean', 'test', 'build', 'minify', 'measure']);

gulp.task('build', ['test', 'transform', 'minify']);

gulp.task('concat', ['test'], function() {
  const tsResult = gulp.src(srcs).pipe(browserTsProject());

  return tsResult.js.pipe(gulp.dest(dist));
});

gulp.task('minify', ['concat'], function() {
  return gulp.src(dist + '/shady-css.concat.js')
    .pipe(uglify())
    .on('error', function(error) {
      console.error(error);
    })
    .pipe(rename('shady-css.min.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('measure', ['minify'], function() {
  return gulp.src(measureable)
    .pipe(size({
      showFiles: true
    }))
    .pipe(size({
      showFiles: true,
      gzip: true
    }));
});

gulp.task('test', function() {
  return gulp.src('lib/test/*.js', {
    read: false
  }).pipe(mocha());
});

gulp.task('clean', function() {
  del.sync([dist]);
});

gulp.task('watch', function(done) {
  gulp.watch(src, ['default', 'minify', 'measure']);
});
