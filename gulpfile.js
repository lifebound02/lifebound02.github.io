'use strict';
/*****************************************
Variables
******************************************/
//Dependency Variables
var autoprefixer = require('gulp-autoprefixer'),
	 browserSync = require('browser-sync').create(),
		  concat = require('gulp-concat'),
			 del = require('del'),
			 ejs = require("gulp-ejs"),
		  filter = require('gulp-filter'),
			gulp = require('gulp'),
		  minify = require('gulp-minify'),
		  notify = require('gulp-notify'),
		 plumber = require('gulp-plumber'),
	 runSequence = require('run-sequence'),
			sass = require('gulp-sass'),
	  sourcemaps = require('gulp-sourcemaps');
//Browsersync Variables
var sitePort = Math.floor(Math.random() * (49150 - 1024 + 1)) + 1024;
var uiPort = sitePort + 1;


/*****************************************
JavaScript Tasks
******************************************/
//Delete old compiled JS
gulp.task('cleanJS', function() {
	return del('www/script-library/frontEnd*.js');
});
//Conconate JS
gulp.task('concatJS', ['cleanJS'], function() {
	return gulp.src(['script-library/jquery-1.12.3.js',
			'script-library/jquery.*.js',
			'script-library/**',
			'!script-library/frontEnd*.js'])
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(concat('frontEnd.js'))
		.on('error', function(err) {
			new Error(err);
		})
		.pipe(plumber.stop())
		.pipe(gulp.dest('./script-library/'));
});
//Minify JS
gulp.task('minifyJS', ['concatJS'], function() {
	return gulp.src('script-library/frontEnd.js')
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(minify({
			noSource: true,
			mangle: false
		}))
		.on('error', function(err) {
			new Error(err);
		})
		.pipe(plumber.stop())
		.pipe(gulp.dest('./www/script-library/'))
		.pipe(browserSync.stream());
});


/*****************************************
SCSS/CSS Tasks
******************************************/
//Delete old compiled CSS
gulp.task('cleanCSS', function() {
	return del('www/style-library/css/**');
});
//Compile SCSS, Prefix, Write Sourcemap
gulp.task('compileCSS', ['cleanCSS'], function() {
	return gulp.src(['style-library/sass/**/*.scss', '!style-library/sass/**/_*.scss'])
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'})
		.on('error', function(err) {
			new Error(err);
		}))
		.pipe(autoprefixer({
			browsers: ['last 3 versions', 'iOS >= 7'],
			cascade: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('www/style-library/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});


/*****************************************
EJS/HTML Compile Tasks
******************************************/
gulp.task('compileEJS', function() {
	return gulp.src(['*.ejs'])
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(ejs({}, {ext:'.html'}))
		.on('error', function(err) {
			new Error(err);
		})
		.pipe(gulp.dest('www/'))
		.pipe(browserSync.stream());
});


/*****************************************
Move assets
******************************************/
gulp.task('moveAssets', function(){
	return gulp.src(['image-library/**', 'file-library/**', 'style-library/fonts/**'], {base: './'})
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(gulp.dest('www/'))
		.on('error', function(err) {
			new Error(err);
		})
		.pipe(browserSync.stream());
});


/*****************************************
BrowserSync & Watch Tasks
******************************************/
//Browsersync watch and serve changes
gulp.task('serve', ['compileCSS', 'minifyJS', 'compileEJS', 'moveAssets'], function() {
	browserSync.init({
		server: {
			baseDir: './www/'
		},
		notify: false,
		port: sitePort,
		ui: {
			port: uiPort
		}
	});
	gulp.watch(['style-library/sass/**/*.scss'], ['compileCSS']);
	gulp.watch(['script-library/**', '!script-library/frontEnd*.js'], ['minifyJS']);
	gulp.watch(['*.ejs', 'partials/*.ejs'], ['compileEJS']);
	gulp.watch(['image-library/**', 'file-library/**', 'style-library/fonts/**'], ['moveAssets']);
});
//Delete old www/ directory
gulp.task('clean', function(){
	return del('www/');
});
//Default gulp task start watching
gulp.task('default', function() {
  runSequence('clean', 'serve');
});