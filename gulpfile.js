var gulp = require('gulp')
var postcss = require('gulp-postcss')
var rucksack = require('rucksack-css')
//var autoprefixer = require('autoprefixer')
var cssnext = require('postcss-cssnext')
var cssnested = require('postcss-nested')
var mixins = require('postcss-mixins')
var lost = require('lost')
var atImport = require('postcss-import')
var csswring = require('csswring')
var browserSync = require('browser-sync').create()

// Servidor de desarrollo
gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: '.'
		}
	})
})

// Tarea para procesar el CSS
gulp.task('css',function() {

	var processors = [
//		autoprefixer({ browsers: ['> 5%', 'ie 8'] }),
		atImport(),
		mixins(),
		cssnested,
		lost(),
		rucksack(),
		cssnext({ browsers: [ '> 5%', 'ie 8' ] }),
		csswring()
	]

	return gulp.src('./src/trivia.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.stream())
})

// Tarea para vigilar los cambios
gulp.task('watch', function() {
	gulp.watch('./src/*.css',['css'])
	gulp.watch('./*.html').on('change',browserSync.reload)
})

gulp.task('default',['watch','serve'])