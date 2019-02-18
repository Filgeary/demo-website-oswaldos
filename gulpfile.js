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
var del = require('del');
var imagemin = require("gulp-imagemin");
var webp = require('imagemin-webp');
var svgstore = require('gulp-svgstore');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

// Compile SASS into CSS, add Autoprefixer & auto-inject into browsers
gulp.task('style', function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(plumber.stop())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

// Minify CSS & auto-inject into browsers
gulp.task('minifyStyle', function () {
  return gulp.src("src/css/style.css")
    .pipe(minify())
    .pipe(gulp.dest("build/css"));
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

// Convert images to WebP
gulp.task('webp', function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(imagemin([
      webp({
        quality: 75
      })
    ]))
    .pipe(rename({
      extname: ".webp"
    }))
    .pipe(gulp.dest("build/img"));
});

// DevSprite - Combine svg files into SVG Sprite
gulp.task('devSprite', function () {
  return gulp.src("src/img/svg-sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img"));
});

// ProdSprite - Combine svg files into SVG Sprite
gulp.task('prodSprite', function () {
  return gulp.src("build/img/svg-sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// Copy files
gulp.task('copy', function () {
  return gulp.src([
      "src/fonts/**/*.{woff,woff2}",
      "src/*.html",
      "src/js/**"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

// Delete files
gulp.task('clean', function () {
  return del("build");
});

// Dev Server
gulp.task('devServer', function () {

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

// Prod Server
gulp.task('prodServer', function () {

  browserSync.init({
    server: "./build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

});

// Complex Tasks
// gulp.task('default', ['devServer']);

// DEV
gulp.task('dev', function (done) {
  runSequence(
    "clean",
    "style",
    "devSprite",
    done
  );
});

// PROD
gulp.task('build', function (done) {
  runSequence(
    "clean",
    "style",
    "minifyStyle",
    "images",
    "webp",
    "prodSprite",
    "copy",
    done
  );
});
