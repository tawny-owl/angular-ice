var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var paths = ['./src/*.js']

gulp.task('default', ['scripts', 'watch'])
  .task('scripts', scripts)
  .task('watch', watch);

function scripts() {
  return gulp.src(paths)
    .pipe(concat('angular-ice.js'))
    .pipe(gulp.dest('./build/'));
}

function watch() {
  gulp.watch('src/*.js',['scripts']);
}