var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var pngquant = require('imagemin-pngquant');
var del = require('del');
var browserSync = require("browser-sync");

sass.compiler = require('node-sass');

function server(done) {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
  });
  done();
}

function cssTranspile() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        grid: true,
      }),
      cssnano({
        autoprefixer: false,
      }),
    ]))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({ stream: true }));
}

function jsTranspile() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({ stream: true }));
}

function imageMinify() {
  return gulp.src('src/img/**/*', { since: gulp.lastRun(imageMinify) })
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }))
    .pipe(imagemin([
      imagemin.gifsicle({
        optimizationLevel: 3,
      }),
      pngquant({
        quality: [ 0.65, 0.8 ], speed: 1
      }),
      imageminJpegtran({
        progressive: true,
      }),
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: false,
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/img/'))
    .pipe(browserSync.reload({ stream: true }));
}

function cleanImage() {
  return del(['dist/img/']);
}

function watch(done) {
  gulp.watch(['src/scss/*', 'src/scss/**/*'], cssTranspile);
  gulp.watch(['src/js/*', 'src/js/**/*'], jsTranspile);
  gulp.watch(['src/img/*', 'src/img/**/*'], imageMinify);
  done();
}

exports.default = gulp.parallel(cleanImage, imageMinify, jsTranspile, cssTranspile, server, watch);
exports.imagemin = gulp.series(cleanImage, imageMinify);
