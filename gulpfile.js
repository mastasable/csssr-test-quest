"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var opn = require('opn');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var wiredep = require('wiredep').stream;
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');


// Подключаемся к серверу

gulp.task('connect', function  () {
	connect.server({
		root: './app',
		livereload: true
	});
	opn('http://localhost:8080');
});

// html

gulp.task('html', function(){
	gulp.src('./app/*.html')
		.pipe(connect.reload());
});

//  js

gulp.task('js', function(){
	gulp.src('./app/js/*.js')
		.pipe(connect.reload());
});

// styles

gulp.task('styles', function () {
  gulp.src('./app/scss/*.scss')
	.pipe(sass())
	.pipe(autoprefixer('last 10 versions'))
	.pipe(gulp.dest('app/css'))
	.pipe(connect.reload());
});

//bower
gulp.task('bower', function  () {
	gulp.src('./app/*.html')
		.pipe(wiredep({
			directory: './app/bower_components'
		}))
		.pipe(gulp.dest('./app'));
});

// Слежка

gulp.task('watch', function  () {
	gulp.watch(['./app/*.html'], ['html']);
	gulp.watch(['./app/scss/*.scss'], ['styles']);
	gulp.watch(['./app/js/*.js'], ['js']);
});

// Сборка

gulp.task('dist', function () {
	var assets = useref.assets();
	
	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['connect', 'watch']);