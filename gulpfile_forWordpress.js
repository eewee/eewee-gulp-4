//--------------------------------------------------------------------
// Source : https://www.pixemweb.com/blog/gulp-4-0-0-with-nodejs-imagemin-browsersync-sass-sourcemaps-cleancss-more/
// YouTube: https://www.youtube.com/watch?v=tTrPLQ6nOX8
//--------------------------------------------------------------------
var themename = 'devwp';
var gulp = require( 'gulp' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    browserSync  = require( 'browser-sync' ).create(),
    reload  = browserSync.reload,
    sass  = require( 'gulp-sass' ),
    cleanCSS  = require( 'gulp-clean-css' ),
    sourcemaps  = require( 'gulp-sourcemaps' ),
    concat  = require( 'gulp-concat' ),
    imagemin  = require( 'gulp-imagemin' ),
    changed = require( 'gulp-changed' ),
    uglify  = require( 'gulp-uglify' ),
    lineec  = require( 'gulp-line-ending-corrector' );

var root  = '../' + themename + '/',
    scss  = root + 'sass/',
    js  = root + 'src/js/',
    jsdist  = root + 'dist/js/';

// Watch Files

var PHPWatchFiles  = root + '**/*.php',
    styleWatchFiles  = root + '**/*.scss';

// Used to concat the files in a specific order.
var jsSRC = [
    js + 'bootstrap.bundle.js',
    js + 'bootstrap-hover.js',
    js + 'nav-scroll.js',
    js + 'prism.js',
    js + 'resizeSensor.js',
    js + 'sticky-sidebar.js',
    js + 'sticky-sb.js',
    js + 'skip-link-focus-fix.js'
];

// Used to concat the files in a specific order.
var cssSRC =  [
    root + 'src/css/bootstrap.css',
    root + 'src/css/all.css',
    root + 'src/css/prism.css',
    root + 'style.css',
];

var imgSRC = root + 'src/images/*',
    imgDEST = root + 'dist/images/';

function css() {
    return gulp.src([scss + 'style.scss'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(lineec())
        .pipe(gulp.dest(root));
}

function concatCSS() {
    return gulp.src(cssSRC)
        .pipe(sourcemaps.init({loadMaps: true, largeFile: true}))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./maps/'))
        .pipe(lineec())
        .pipe(gulp.dest(scss));
}

function javascript() {
    return gulp.src(jsSRC)
        .pipe(concat('devwp.js'))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(jsdist));
}

function imgmin() {
    return gulp.src(imgSRC)
        .pipe(changed(imgDEST))
        .pipe( imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe( gulp.dest(imgDEST));
}

function watch() {
    browserSync.init({
        open: 'external',
        proxy: 'http://localhost:8888/demowp',
        port: 8080,
    });
    gulp.watch(styleWatchFiles, gulp.series([css, concatCSS]));
    gulp.watch(jsSRC, javascript);
    gulp.watch(imgSRC, imgmin);
    gulp.watch([PHPWatchFiles, jsdist + 'devwp.js', scss + 'style.min.css']).on('change', browserSync.reload);
}

exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task('default', build);