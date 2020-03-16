const gulp = require('gulp');
const mocha = require('gulp-mocha');
const webpack = require('webpack-stream');

const test = () => {
    return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list', require: ['babel-register']}));
};

const pack = () => {
    return gulp.src('src/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('dist/'));
};

gulp.task('test', test);

gulp.task('webpack', ['test'], pack);

gulp.task('build', ['webpack']);
