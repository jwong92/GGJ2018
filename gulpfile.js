var gulp = require('gulp');
var bs = require('browser-sync').create();

gulp.task('browser-sync', function() {
	bs.init({
		proxy: {
			target: "localhost:5000",
			ws: true // enables websockets
		}
	});
});

gulp.task('default', ['browser-sync'], function () {
	gulp.watch(["public/**/*.html","public/**/*.js","public/**/*.css"]).on('change', bs.reload);
});