var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('style', function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(plumber.stop())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['style'], function () {

  browserSync.init({
    server: "./src",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/*.scss", ['style']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
