const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
});

//Работа с CSS файлов: минифицирование, переименование, очистка.

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie11'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

//Отслеживание изменений в файлах

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/*.js").on('change', gulp.parallel('scripts'));
});

// Перемещение и минифицирование HTML файла

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
});

// Перемещение JS файла

gulp.task('scripts', function () {
    return gulp.src("src/js/*.js")
        .pipe(gulp.dest('dist/js'));
});

// Перемещение Шрифты файла

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest('dist/fonts'));
});

// Перемещение Иконок файла

gulp.task('icons', function () {
    return gulp.src("src/icons/*")
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'html'));