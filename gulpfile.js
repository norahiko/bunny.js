var gulp = require('gulp');
var concat = require('gulp-concat');

var srcFiles = [
    'src/header.js',
    'src/hub.js',
    'src/pub.js',
    'src/sub.js',
    'src/footer.js',
];


gulp.task('default', ['build']);

gulp.task('watch', function() {
    gulp.watch(srcFiles, ['build']);
});

gulp.task('build', function() {
    return gulp.src(srcFiles)
               .pipe(concat('bunny.js'))
               .pipe(gulp.dest('./'));
});

