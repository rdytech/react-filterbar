require("harmonize")();

var babelify = require('babelify');
var browserify = require('browserify');
var debug = require('gulp-debug');
var del = require('del');
var gulp = require('gulp');
var jest = require('gulp-jest');
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var package = require('./package.json');

var scriptsPath = package.paths.scripts;
var buildPath = package.paths.build;
var examplePath = package.paths.example;
var testPath = package.paths.test;

var appName = package.name;
var appFile = 'app.js';
var appDistFile = appName + '.js';
var appMinDistFile = appName + '.min.js';

gulp.task('dev', function() {
  browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appDistFile))
  .pipe(gulp.dest('example/public/js'));
})

gulp.task('devloop', function() {
  gulp.watch([scriptsPath + '/**/*.*'], ['dev']);
})

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

gulp.task('wneptune', function() {
  gulp.watch([scriptsPath + '/**/*.*', './__tests__/**/*.*'], ['neptune']);
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
  .pipe(gulp.dest('example/public/js'));
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
  .pipe(gulp.dest('/Users/emersonxavier/Code/neptune/vendor/assets/bower_components/react-filterbar/dist'));
});

gulp.task('build', ['delete'], function () {
  return browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appDistFile))
  .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['build'], function() {
  return gulp.src('dist/' + appDistFile)
  .pipe(uglify())
  .pipe(rename(appMinDistFile))
  .pipe(gulp.dest('dist'));
});

gulp.task('delete', function() {
  return del('dist/*.js', function(err, deletedFiles) {
    console.log("Files deleted:",deletedFiles.join(', '));
  });
});

gulp.task('default',['example','neptune','watch']);
gulp.task('dist', ['compress']);
