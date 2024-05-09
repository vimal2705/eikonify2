// Enable ES module support
require = require('esm')(module);

// Now you can import ES modules
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser');

// Paths
const paths = {
  styles: {
    src: 'assets/scss/**/*.scss',
    dest: 'assets/dist/css/'
  },
  scripts: {
    src: 'assets/js/**/*.js',
    dest: 'assets/dist/js/'
  }
};

// Styles task: Compile SCSS, concatenate, autoprefix, minify, and rename
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(postcss([autoprefixer()])) // Use postcss and autoprefixer here
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
}

// Scripts task: Concatenate, minify, and rename JS files
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Watch task: Watch SCSS and JS files for changes
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

// Default task
exports.default = gulp.series(gulp.parallel(styles, scripts), watch);
