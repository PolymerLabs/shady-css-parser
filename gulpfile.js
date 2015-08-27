'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var del = require('del');

var src = ['src/shady-css-parser/*.js', 'src/*.js'];
var dest = 'dist/';

gulp.task('default', ['clean'], function() {
  return gulp.src(src)
    .pipe(babel({
      modules: 'umd'
    }))
    .pipe(concat('shady-css-parser.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('clean', function(done) {
  del([dest], done);
});

gulp.task('watch', function(done) {
  gulp.watch(src, ['default']);
});
