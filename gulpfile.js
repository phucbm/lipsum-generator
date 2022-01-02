const gulp = require('gulp'),
    browserSync = require('browser-sync').create();

/**
 * Serve
 */
gulp.task('serve', function(){
    gulp.watch('**').on('change', () => {
        browserSync.reload();
    });

    browserSync.init({
        server: ["./"]
    });
});