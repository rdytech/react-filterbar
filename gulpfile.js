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

var appName = 'reactFilterbar';
var appFile = appName + '.js';
var appDistFile = appName + '-' + package.version + '.js';
var appMinDistFile = appName + '-' + package.version + '.min.js';

gulp.task('watch', function() {
  gulp.watch(scriptsPath, ['example']);
});

gulp.task('example', function () {
  browserify({
    entries: './src/' + appFile,
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source(appFile))
  .pipe(gulp.dest('example/rails/filterbar_example/vendor/assets/javascripts'));
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

gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('**')
        .pipe(jest({
            scriptPreprocessor: nodeModules + '/babel-jest',
            testPathIgnorePatterns: [
                "node_modules",
                "test/support"
            ],
            moduleFileExtensions: [
                "jsx",
                "js",
                "json",
                "react"
            ],
            //rootDir: "src",
            testDirectoryName: "test",
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});

gulp.task('test', ['jest']);
gulp.task('default',['example','watch']);
gulp.task('dist', ['build', 'compress']);