var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('js-watch', function (done) {
    browserSync.reload();
    done();
});
gulp.task('html-watch', function (done) {
    browserSync.reload();
    done();
});
gulp.task('serve', function () {

    browserSync.init({
        server: {
            baseDir: "demos",
            routes: {
                "/node_modules": "node_modules",
                "/src": "src"
            }
        }
    });

    gulp.watch("demos/*.html", ['html-watch']);
    gulp.watch("demos/*.js", ['js-watch']);
    gulp.watch("demos/*/*.js", ['js-watch']);
    gulp.watch("src/*/*.js", ['js-watch']);
});
gulp.task("default", ["serve"]);