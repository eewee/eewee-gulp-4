# Gulp 4
Compilation scss to css and minify css/js with Gulp 4.

## Install
### init
npm init -y
npm install

### Local :
#### install local (only this project) - NOT USE IT, because "npm install" it's enough
npm install gulp gulp-babel gulp-clean-css gulp-concat gulp-imagemin gulp-notify gulp-rename gulp-sass gulp-sourcemaps gulp-uglify -D
#### exec local (ex: images is my function)
npx gulp images
#### exec local (ex: all)
npx gulp
#### exec local (watch)
npx gulp watch

### Global :
#### install global (for all)
npm install gulp-cli -g
#### exec global (ex: images is my function)
gulp images

### create gulp file (all code is here)
gulpfile.js
