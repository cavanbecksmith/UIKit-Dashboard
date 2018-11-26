// --------------------
// --- REQUIRE MODULES
// --------------------

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var htmlmin = require('gulp-htmlmin');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync").create();
var rename = require("gulp-rename");
var gutil = require('gulp-util');
var concat = require('gulp-concat');
const chalk = require('chalk');
const log = console.log;
var del = require('del');
var requireHTML = true;

// ------------------
// --- DEFAULT TASKS
// ------------------

gulp.task('default', [], function(){
  log(chalk.yellow(`
   ____ ____ ____ ____ ____ 
  ||T |||a |||s |||k |||s ||
  ||__|||__|||__|||__|||__||
  |/__\|/__\|/__\|/__\|/__\|
  `));
  log(chalk.white.bgRed.bold('* Gulp dev'));
  log(chalk.white.bgGreen.bold('* Gulp build'));
  log(chalk.white.bgBlue.bold('* Gulp ftp'));
});


// gulp.task('production',['minjs','mincss'], function(){});
gulp.task('production',['webpack','sass','fonts', 'libs', 'css'], function(){});

gulp.task('dev',['webpack','sass','fonts', 'libs', 'css', 'img'], function(){

  if(requireHTML){
    gulp.run('html');
    gulp.watch("src/index.html", ['html']).on('change', browserSync.reload);
    gulp.watch("src/snippets.html", ['html']).on('change', browserSync.reload);
  }

  browserSync.init({
      open: false,
      server: "./dist",
      notify: false
  });
  gulp.watch("src/libs/*.js", ['libs']).on('change', browserSync.reload);
  gulp.watch("src/css/*.css", ['css']).on('change', browserSync.reload);
  gulp.watch("src/js/**/*", ['webpack']).on('change', browserSync.reload);
  gulp.watch("src/fonts/*.*", ['fonts']).on('change', browserSync.reload);
  gulp.watch("src/scss/**/*.scss", ['sass']).on('change', browserSync.reload);
  gulp.watch("src/img/**/*.*", ['img']).on('change', browserSync.reload);
});

gulp.task('libs', function () {
  return gulp.src('./src/libs/*.js')
    .pipe(uglify())
    .on('error', function (err) { 
      gutil.log(gutil.colors.red('[Error]'), err.toString()); 
    })
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
  return gulp.src('./src/css/*.css')
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('img', function () {
  return gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});


// ----------------
// --- DEV TASKS
// ----------------

// --- SASS
gulp.task('sass', function () {
  return gulp.src('./src/scss/**/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: './dist/css',
      basename: 'style',
    }))
    .pipe(gulp.dest(''));
});


// --- JS (WEBPACK)
gulp.task('webpack', function() {
  return gulp.src('./src/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .on('error', function (err) {
      gutil.log('WEBPACK ERROR', err.message);
      this.emit('end');
    })
    .pipe(rename({
      dirname: './dist/js',
      basename: 'main',
    }))
    .pipe(gulp.dest(''));
});

// --- FONTS
gulp.task('fonts', function () {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});


// --------------------
// --- PRODUCTION TASKS
// --------------------

gulp.task('webpack:prod', function() {
  return gulp.src('./src/js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(uglify())
    .pipe(rename({
      dirname: './dist/js',
      basename: 'main',
      suffix: ".min"
    }))
    .pipe(gulp.dest(''));
});

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('sass:prod', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({
      dirname: './dist/css',
      basename: 'style',
      suffix: ".min",
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(''));
});

gulp.task('prod',['webpack:prod', 'sass:prod'], function(){});

gulp.task('clean', () => {
    return del.sync('./dist');
});


// --------------------
// --- OPTIONAL HTML
// --------------------

gulp.task('html', function() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist/'));
});