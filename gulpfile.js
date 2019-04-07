/**
 * # Task Runner - Gulp 4
 * Syntax 01
 *
 * ## Run (all)
 * npx gulp
 *
 * ## Run (watch only with browser-sync)
 * npx gulp watch
 *
 */
// Gulp (https://www.npmjs.com/package/gulp)
const gulp        = require('gulp')
// Compile scss to css (https://www.npmjs.com/package/gulp-sass)
const sass        = require('gulp-sass')
// Rename file (https://www.npmjs.com/package/gulp-rename)
const rename      = require('gulp-rename')
// Minify JS with UglifyJS3 (https://www.npmjs.com/package/gulp-uglify)
const uglify      = require('gulp-uglify')
// Minify CSS (https://www.npmjs.com/package/gulp-clean-css)
const cleancss    = require('gulp-clean-css')
// Concat all file, in one (https://www.npmjs.com/package/gulp-concat)
const concat      = require('gulp-concat')
// Images size more small (https://www.npmjs.com/package/gulp-imagemin)
const imagemin    = require('gulp-imagemin')
// Notification on your Mac/PC (https://www.npmjs.com/package/gulp-notify)
const notify      = require('gulp-notify')
// Write ES6 > compile to ES5 (https://www.npmjs.com/package/gulp-babel)
//const babel     = require('gulp-babel')

// Browser Sync (for live render -  (https://www.npmjs.com/package/browser-sync))
const browsersync = require('browser-sync').create()
// Clean folder (https://www.npmjs.com/package/del)
const del         = require('del')
// SourceMaps, add path impacted file (https://www.npmjs.com/package/gulp-sourcemaps)
const sourcemaps  = require('gulp-sourcemaps')

// PATH
const paths = {
    js: {
        src: ['./src/js/**/*.js'],
        dest: './dist/js'
    },
    css: {
        src: ['./src/scss/**/*.scss'],
        dest: './dist/css'
    },
    images: {
        src: ['./src/images/**/*'],
        dest: './dist/images'
    },
    html: {
        src: ['./*.html']
    }
}

// BROWSER SYNC (live)
const browserSyncWatch = () => {
    browsersync.init({
        server: { baseDir: "./" },
        // ou proxy: "yourlocal.dev",
        port: 3000
    })
}

// CLEAN FOLDER
const clean = () => del(['dist'])

// CSS
const styles = () =>
    gulp.src(paths.css.src)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleancss({debug: true, compatibility: 'ie8'}, (details) => {
            console.log(`${details.name} (original size): ${details.stats.originalSize}`);
            console.log(`${details.name} (minify size): ${details.stats.minifiedSize}`);
        }))
        .pipe(concat('styles.css'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browsersync.stream())
        //.pipe(notify("Css ok !"))// JS
const scripts = () =>
    gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browsersync.stream())
        //.pipe(notify("Js ok !"))

// IMAGES
const images = () =>
    gulp.src(paths.images.src, {since: gulp.lastRun(images)} )
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.images.dest))
        //.pipe(notify("Images ok !"))

// WATCH
const watchFiles = () =>
    gulp.watch(paths.js.src, scripts)
    gulp.watch(paths.css.src, styles)
    gulp.watch(paths.images.src, images)

// PROCESS :
const watcher = gulp.parallel(watchFiles, browserSyncWatch)
const build = gulp.series(clean, gulp.parallel(styles, scripts, images));

// EXPORT TASK
// exports.clean = clean        // exec with : npx gulp clean
// exports.scripts = scripts    // exec with : npx gulp scripts
// exports.styles = styles      // exec with : npx gulp styles
// exports.images = images      // exec with : npx gulp images
exports.watch = watcher         // exec with : npx gulp watcher
exports.default = build         // exec with : npx gulp

//gulp.task('default', styles)