// Gulp 3.9.1
// =====================================================================

// Load plugins
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require("gulp-imagemin");
var browserSync = require('browser-sync').create();

// Compile SASS into CSS, add Autoprefixer, Minify, Rename & auto-inject into browsers
gulp.task('style', function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(plumber.stop())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })
    ]))
    .pipe(gulp.dest("build/img"));
});

// Static Server
gulp.task('serve', ['style'], function () {

  browserSync.init({
    server: "./src",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  // Watch files
  gulp.watch("src/sass/**/*.scss", ['style']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
  gulp.watch("src/js/*.js").on('change', browserSync.reload);
});

// Complex Tasks
gulp.task('default', ['serve']);
