var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglifyes'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    concat = require('gulp-concat'),
    reload = browserSync.reload,
    groupCssMediaQueries = require('gulp-group-css-media-queries'),
    gulpIf = require('gulp-if'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    pug = require('gulp-pug'),
    beautify = require('gulp-jsbeautifier'),
    env = gutil.env.env;

console.log(env);

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        pug: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        root: 'build/',
    },
    
    src: { //Пути откуда брать исходники
        pug: [
            'src/templates/index.pug',
            'src/templates/pages/*.pug'
        ],
        js: [

            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/slick-carousel/slick/slick.min.js',
            // 'node_modules/swiper/swiper-bundle.js',
            'node_modules/svg4everybody/dist/svg4everybody.legacy.min.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            'node_modules/object-fit-images/dist/ofi.min.js',
            //'node_modules/wowjs/dist/wow.min.js',
            //'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',

            //'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
            //'node_modules/parsleyjs/dist/parsley.min.js',
            //'node_modules/js-parallax/dist/parallax.min.js',

            'src/js/main.js',
        ],
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        root: 'src/root/**/*.*',
    },

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        pug: 'src/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        root: 'src/root/**/*.*',
    },

    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    // tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: ""
};

gulp.task('templates:build', function buildHTML() {
    return gulp.src(path.src.pug)
    .pipe(pug({
        // pretty: true
    }))
    .pipe(beautify({
        indent_char: ' ',
        indent_size: 4,
        inline: [
            'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'canvas', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 
            'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', /* 'script', */ 'select', 'small',
            'strong', 'sub', 'sup', 'template', 'textarea', 'time', 'u', 'var',
            'video', 'wbr', 'text',
            // obsolete inline tags
            'acronym', 'big', 'strike', 'tt'
          ] //remove tags: a, span, svg, button, img,
    }))
    .pipe(gulp.dest(path.build.pug))

});

gulp.task('js:build', function () {
    return gulp.src(path.src.js) //Найдем наш main файл
        .pipe(concat('scripts.js'))
        .pipe(gulpIf(env !== 'dev',uglify()))//Сожмем наш js

        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(gulpIf(env == 'dev', sourcemaps.init()))
        .pipe(sass()) //Скомпилируем
        .pipe(concat('styles.css'))
        .pipe(gulpIf(env !== 'dev', prefixer({
            overrideBrowserslist: ['last 10 versions'],
            cascade: false
        }))) //Добавим вендорные префиксы
        .pipe(gulpIf(env !== 'dev', groupCssMediaQueries())) //Группируем медиазапросы
        .pipe(gulpIf(env !== 'dev', cssmin())) //Сожмем
        .pipe(cleanCSS())
        .pipe(gulpIf(env == 'dev', sourcemaps.write('')))
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});


gulp.task('root:build', function (done) {
    gulp.src(path.src.root)
        .pipe(gulp.dest(path.build.root))
    done();
});

gulp.task('build', gulp.series([
    'templates:build',
    'style:build',
    'js:build',
    'image:build',
    'root:build'
]));

gulp.task('watch', function () {
    watch([path.watch.pug], gulp.series('templates:build'));
    watch([path.watch.style],gulp.series('style:build') );
    watch([path.watch.js], gulp.series('js:build'));
    watch([path.watch.img],  gulp.series('image:build'));
    watch([path.watch.root], gulp.series('root:build'));
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', gulp.parallel(['build']));
gulp.task('dev', gulp.parallel(['build', 'webserver', 'watch']));
