require("harmonize")();
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var jest = require('gulp-jest');
var debug = require('gulp-debug');
var path = require('path');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

var package = require('./package.json');

var scriptsPath = package.paths.scripts;
var buildPath = package.paths.build;
var examplePath = package.paths.example;
var testPath = package.paths.test;

var appName = package.name;
var appFile = 'app.js';
var appDistFile = appName + '.js';
var appMinDistFile = appName + '.min.js';

gulp.task('jest', function() {
  return gulp.src('__tests__')
    .pipe(jest({
      "globals": {
        "__DEV__": true
      },
      "scriptPreprocessor": "./preprocessor.js",
      "testPathIgnorePatterns": [
        "test_helper.js",
        "preprocessor.js"
      ],
      "testFileExtensions": [
        "js",
        "react",
        "jsx"
      ],
      "unmockedModulePathPatterns": [
        "..//node_modules/react"
      ]
    }));
});

gulp.task('testWatch', function() {
  gulp.watch([scriptsPath + '/**/*.*', './__tests__/**/*.*'], ['jest']);
})

gulp.task('watch', function() {
  gulp.watch([scriptsPath + '/**/*.*', './__tests__/**/*.*'], ['example','neptune']);
});

gulp.task('example', function () {
  browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appDistFile))
  .pipe(gulp.dest('dist/'));
});

gulp.task('neptune', function() {
  browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appDistFile))
  .pipe(gulp.dest('/Users/jacobb1/development/jr/neptune/lib/assets/static/bower_components/react-filterbar/dist'));
});

gulp.task('build', function () {
  del('dist/*.js', function(err, deletedFiles) {
    console.log("Files deleted:",deletedFiles.join(', '));
  });
  browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appDistFile))
  .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['build'], function() {
  gulp.src('dist/' + appDistFile)
  .pipe(uglify())
  .pipe(rename(appMinDistFile))
  .pipe(gulp.dest('dist'));
});

gulp.task('default',['example','neptune','watch']);
gulp.task('dist', ['build', 'compress']);
