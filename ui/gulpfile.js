var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    nodemon = require('gulp-nodemon'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    browserSync = require('browser-sync').create();

var util = require('util');
var exec = require('child_process').exec;
var root_js_path = './bower_components/';
var root_css_path = './public/assets/css/';

var vendor_js_path = [
        root_js_path + "jquery/dist/jquery.min.js",
        root_js_path + "react/react.min.js",
        root_js_path + "react/react-dom.min.js",
        root_js_path + "react/react-dom-server.min.js",
        root_js_path + "react/react-with-addons.min.js"
    ];

var vendor_css_path = [
        root_css_path + "vendorcss/" + "/bootstrap/bootstrap.min.css",
        root_css_path + "vendorcss/" + "/font-awesome/font-awesome.min.css",

];

var app_css_path = [
    root_css_path + "registration.css",
    root_css_path + "app.css",
    root_css_path + "base.css"
]
gulp
    //Bundle all Third Party Plugins
    .task('vendor_js',function(){
        gulp.src(vendor_js_path)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/assets'));
    })

    //Bundle all Third Party CSS
    .task('vendor_css',function(){
        gulp.src(vendor_css_path)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/assets/css/vendorcss'))
    })
    // performs magic
    .task('transform', function(){
        gulp.src('public/js/app.js')
            .pipe(plumber())
            .pipe(
                browserify({
                    transform: 'reactify',
                    debug: true
                })
            )
            .pipe(concat('app.js'))
            .pipe(plumber.stop())
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream());
    })
    // moves source files to dist
    .task('copy', function(){
        gulp
            .src('public/index.html')
            .pipe(gulp.dest('dist'));
        gulp
            .src('public/assets/css/images/*.*')
            .pipe(gulp.dest('dist/assets/css/images'));
        gulp
            .src('public/assets/css/vendorcss/fonts/*.*')
            .pipe(gulp.dest('dist/assets/css/fonts'))
        gulp
            .src(app_css_path)
            .pipe(concat('app.css'))
            .pipe(gulp.dest('dist/assets/css'));

    })

    // node api Server
    .task('node-app', function () {
        nodemon({ script: 'routes/node-app.js'})
        .on('restart', function () {
            console.log('restarted!')
        })
    })

    // watch for source changes
    .task('watch', function(){
        gulp.watch("public/**/*.js",[""])
            .on("change", browserSync.reload);
    })

    .task('reload',['transform', 'copy'],browserSync.reload)

    .task('server', ['vendor_css','vendor_js','transform','copy'], function() {
        browserSync.init({
            server: "./dist",
            port: 7979
        });
        gulp.watch("public/**/*.*",["reload"]);
    }).

    task("redis-server",function(){
        exec('redis-server',function (error, stdout, stderr) {
           console.log(stdout);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }).

    task("seaweedfs-server",function(){
        exec('./seaweedfs/weed server -master.port=9333 -volume.port=8080 -dir="./seaweedfs/data"',function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    });


