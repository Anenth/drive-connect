'use strict';

var gulp = require('gulp');
var del = require('del');


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream'),

sourceFile = './app/scripts/app.js',

destFolder = './dist/scripts',
destFileName = 'app.js';


// Styles
gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
  .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
  .pipe($.rubySass({
    style: 'expanded',
    precision: 10,
    loadPath: ['app/bower_components']
  }))
  .pipe($.plumber.stop())
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('dist/styles'))
  .pipe($.size());
});


// Scripts
gulp.task('scripts', function () {
  var bundler = watchify(browserify({
    entries: [sourceFile],
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', $.notify.onError('<%= error.message %>'))
      .pipe(source(destFileName))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest(destFolder));
    }

    return rebundle();

});





gulp.task('jade', function () {
  return gulp.src('app/template/*.jade')
  .pipe($.jade({ pretty: true }))
  .pipe(gulp.dest('dist'));
})



// HTML
gulp.task('html', function () {
  return gulp.src('app/*.html')
  .pipe($.useref())
  .pipe(gulp.dest('dist'))
  .pipe($.size());
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
  .pipe($.cache($.imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
  .pipe($.size());
});



gulp.task('jest', function () {
  var nodeModules = path.resolve('./node_modules');
  return gulp.src('app/scripts/**/__tests__')
  .pipe($.jest({
    scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
    unmockedModulePathPatterns: [nodeModules + '/react']
  }));
});



// Clean
gulp.task('clean', function (cb) {
  del(['dist/styles', 'dist/scripts', 'dist/images'], cb);
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function(){
  return gulp.src('./app/*.html')
  .pipe($.useref.assets())
  .pipe($.useref.restore())
  .pipe($.useref())
  .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean', 'build', 'jest' ]);

// Webserver
gulp.task('serve', function () {
  gulp.src('./dist')
  .pipe($.webserver({
    livereload: true,
    port: 9000
  }));
});

// Bower helper
gulp.task('bower', function() {
  gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
  .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
  gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
  .pipe(gulp.dest('dist/scripts/'));
});


// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);


    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);



    // Watch .jade files
    gulp.watch('app/template/**/*.jade', ['jade', 'html']);


    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
  });
