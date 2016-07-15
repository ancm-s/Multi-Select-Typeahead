var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  inject = require('gulp-inject'),
  stylus = require('gulp-stylus'),
  es = require('event-stream'),
  livereload = require('gulp-livereload'),
  templateCache = require('gulp-angular-templatecache'),
  concat = require('gulp-concat'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  jsmin = require('gulp-jsmin'),
  sass = require('gulp-sass');

gulp.task('styles', function () {
  gulp.src('./web/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./web/'))
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./web/**/*.scss', ['styles']);
  gulp.watch("./web/**/*.js", browserSync.reload);
  gulp.watch("./web/**/*.css", browserSync.reload);
  gulp.watch("./web/**/*.html", browserSync.reload);

});

gulp.task('cacheTemplate', function () {
  gulp.src([
      './src/multi-select-autocomplete.html'
    ])
    .pipe(templateCache("templates.js", {
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('cssminify', function () {
  gulp.src('./web/styles/styles.css')
    .pipe(cssmin())
    .pipe(rename('multiple-select.min.css', {
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('jsminify', function () {
  gulp.src('./dist/multiple-select.js')
    .pipe(jsmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-scss', function () {
  gulp.src('./web/styles/styles.scss')
    .pipe(rename('multiple-select.scss'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-html', function () {
  gulp.src('./src/multi-select-autocomplete.html')
    .pipe(rename('multi-select-autocomplete.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['copy-scss', 'cacheTemplate', 'cssminify', 'jsminify'], function () {
  return gulp.src([
    './src/templates.js',
      './web/app/app.js',
      './src/multi-select-autocomplete.js'
    ])
    .pipe(concat('multiple-select.js'))
    .pipe(gulp.dest('./dist/'));
});

// Static server
gulp.task('serve', ['watch'], function () {
  browserSync.init({
    server: {
      baseDir: "./",
      routes: {
        "static": "static",
        "web": "web"
      }
    },
    port: 5000
  });
});
