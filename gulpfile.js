const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const zip = require('gulp-zip');
const del = require('del');
const version = '3.0.0';


/**
 * Serve: gulp serve
 */
gulp.task('serve', function(){
    gulp.watch('**').on('change', () => {
        browserSync.reload();
    });

    browserSync.init({
        server: ["./"]
    });
});


/**
 * Export extension: gulp export
 */
const files = [
    'assets/**/*.*',
    'index.html',
    'manifest.json'
]

// move files to temp folder
gulp.task('dist', () => {
    return gulp.src(files, {base: './'})
        .pipe(gulp.dest('dist'))
});

// zip temp folder
gulp.task('zip', () => {
    return gulp.src(['dist/**/*.*'], {base: './'})
        .pipe(zip(`lipsum-extension-${version}.zip`))
        .pipe(gulp.dest('extension'));
});

// delete temp folder
gulp.task('clean', function(){
    return del('dist', {force: true});
});

gulp.task('export', gulp.series('dist', 'zip', 'clean'));