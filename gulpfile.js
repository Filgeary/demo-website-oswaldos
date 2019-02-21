// Gulp 3.9.1
// =====================================================================

// TODO:
// - add JS minify (uglify)

// Load plugins
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var webp = require('imagemin-webp');
var svgstore = require('gulp-svgstore');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

// Dev Style
// Compile SASS into CSS, add Autoprefixer & auto-inject into browsers
gulp.task('devStyle', function () {
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

// Prod Style
// Compile SASS into CSS, add Autoprefixer, Minify CSS & auto-inject into browsers
gulp.task('prodStyle', function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(plumber.stop())
    .pipe(gulp.dest("src/css"))
    .pipe(minify())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

// Minify HTML
gulp.task('html', function () {
  return gulp.src("src/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
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

      // TODO:
      // - setup SVG settings (need Practice for Real Projects)
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

// TODO:
// - setup SVG settings (need Practice for Real Projects)

// Dev Sprite - Combine SVG files into SVG Sprite
gulp.task('devSprite', function () {
  return gulp.src("src/img/svg-sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("src/img"));
});

// TODO:
// - setup SVG settings (need Practice for Real Projects)

// Prod Sprite - Combine SVG files into SVG Sprite
gulp.task('prodSprite', function () {
  return gulp.src("build/img/svg-sprite/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

// FIXME:
// after adding JS minify

// Copy files
gulp.task('copy', function () {
  return gulp.src([
      "src/fonts/**/*.{woff,woff2}",
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
  gulp.watch("src/sass/**/*.scss", ['devStyle']);
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

  // Watch files
  gulp.watch("src/sass/**/*.scss", ['prodStyle']);

  // FIXME:
  // after adding JS minify
  gulp.watch("src/*.html", ['html']).on('change', browserSync.reload);
  gulp.watch("src/js/*.js", ['copy']).on('change', browserSync.reload);
});

// Complex Tasks
// gulp.task('default', ['devServer']);

// DEV
gulp.task('dev', function (done) {
  runSequence(
    "clean",
    "devStyle",
    "devSprite",
    done
  );
});

// PROD
gulp.task('build', function (done) {
  runSequence(
    "clean",
    "html",
    "prodStyle",
    "images",
    "webp",
    "prodSprite",
    "copy",
    done
  );
});
