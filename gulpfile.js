var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    cssjanus = require('gulp-cssjanus'),
    package = require('./package.json'),
    fileinclude = require('gulp-file-include'),
    filter = require('gulp-filter'),
	fs = require('file-system');

var conf = {
    path: {
        src: "src",
        app: "app"
    }
}

var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

gulp.task('css', ['copyCSS'], function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copyCSS', function () {
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('app/assets/css'));
});

gulp.task('copyJS', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('app/assets/js'));
});

gulp.task('js', ['copyJS'], function () {
    gulp.src('src/js/main-controller.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest('app/assets/js'))
        .pipe(uglify())
        .pipe(header(banner, {
            package: package
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/assets/js'))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }));
});

gulp.task('fileinclude', function () {
    gulp.src(['src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: false
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('copyPlugins', function () {
    gulp.src(['src/plugins/**/*.*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app/assets/plugins/'));
});

// Images
//gulp.task('images', function () {
//    return gulp.src([
//    		'src/images/**/*'])
//        //.pipe($.cache($.imagemin({
//        //    optimizationLevel: 3,
//        //    progressive: true,
//        //    interlaced: true
//        //})))
//        .pipe(gulp.dest('app/images'));
//});
gulp.task('images', function () {
    return gulp.src('src/images/*.*')
        .pipe(gulp.dest('app/assets/images'));
});
gulp.task('generate-index-file', function (done) {
    var html = "<!DOCTYPE html ><html><head>";
    //    '<ul clas="page-list">';
    //fs.recurseSync(conf.path.src + '/pages/', '*.html', function(filepath, relative, filename) {
    //    html += '<li><a target="_blank" href="pages/' + filename + '">' + filename + '</a></li>';
    //});
    html += '</body></html>';
    fs.writeFileSync(conf.path.app + '/index.html', html);
    done();
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('styles', function () {
    return gulp.src('app/assets/css/*-ar.css')
        .pipe(autoprefixer(["last 2 versions", "> 1%"])) // Other post-processing. 
        .pipe(gulp.dest('app/assets/css')) // Output LTR stylesheets. 
        .pipe(cssjanus()) // Convert to RTL. 
        .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename. 
        .pipe(gulp.dest('app/assets/css')) // Output RTL stylesheets. 
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }, port: 9286
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['fileinclude', 'css', 'js', 'browser-sync', 'copyPlugins', 'images','styles'], function () {
    //gulp.task('default', ['fileinclude', 'css', 'js', 'copyPlugins', 'fonts', 'images'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
    gulp.watch("src/**/*.html", ['fileinclude']);
    //gulp.watch("src/**/*.html", ['fileinclude','generate-index-file']);
});







