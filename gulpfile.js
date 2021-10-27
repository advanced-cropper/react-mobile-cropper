const gulp = require('gulp');

function scss() {
	return gulp.src('src/**/*.scss').pipe(gulp.dest('./dist'));
}

function watch(done) {
	gulp.watch('src/**/*.scss', gulp.series(scss));
	done();
}

const dev = gulp.series(scss, watch);
const build = gulp.series(scss);

exports.watch = dev;
exports.build = build;
exports.default = dev;
