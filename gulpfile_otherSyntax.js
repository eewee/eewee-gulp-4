/**
 * # Task Runner - Gulp 4
 * Syntax 02
 *
 * ## Run (all)
 * npx gulp
 *
 * ## Run (watch only with browser-sync)
 * npx gulp watch
 *
 */
const { src, dest, series, parallel, lastRun, watch } = require('gulp')
const sass = require('gulp-sass')
const rename = require("gulp-rename")
const uglify = require('gulp-uglify')
const cleancss = require('gulp-clean-css')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const notify = require('gulp-notify')
//const babel = require('gulp-babel')
const browsersync = require('browser-sync').create()
const del = require('del')
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
function browserSyncWatch() {
    browsersync.init({
        server: { baseDir: "./" },
        // ou proxy: "yourlocal.dev",
        port: 3000
    })
}

// CLEAN FOLDER
function clean() {
    return del('dist')
}

// CSS
function styles() {
    return src(paths.css.src, {sourcemaps: true})
        .pipe(sass())
        .pipe(cleancss({debug: true, compatibility: 'ie8'}, (details) => {
            console.log(`${details.name} (original size): ${details.stats.originalSize}`);
            console.log(`${details.name} (minify size): ${details.stats.minifiedSize}`);
        }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(paths.css.dest, {sourcemaps: '.'}))
        .pipe(browsersync.stream())
    //.pipe(notify("Css ok !"))
}

// JS
function scripts() {
    return src(paths.js.src)
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(paths.js.dest))
        .pipe(browsersync.stream())
    //.pipe(notify("Js ok !"))
}

// IMAGES
function images () {
    return src(paths.images.src, {since: lastRun(images)} )
        .pipe(imagemin())
        .pipe(dest(paths.images.dest))
}

// WATCH
function watchFiles() {
    watch(paths.css.src, styles)
    watch(paths.js.src, scripts)
    watch(paths.js.src, images)
}

// EXPORT TASK
module.exports = {
    default: series(
        clean,
        parallel(
            styles, scripts, images
        )
    ),
    watch: parallel(watchFiles, browserSyncWatch)
}