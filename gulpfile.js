// 导入需要的模块
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  minifyCss = require('gulp-minify-css'),
  cached = require('gulp-cached'),
  browserSync = require('browser-sync').create();


// 编译前清空
gulp.task('clean', function() {
  gulp.src(['dist/', 'public'])
    .pipe(clean({ force: true }));
});



// 编译sass，其中plumber是防止出错崩溃的插件
gulp.task('sass', function() {
  gulp.src('src/sass/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/css'));
});

// 将所有css文件连接为一个文件并压缩，存到public/css
gulp.task('concatCss', function() {
  gulp.src(['dist/css/*.css'])
    .pipe(concat('main.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/css'));
});


// 将所有js文件连接为一个文件并压缩，存到public/js
gulp.task('concatJs', function() {
  gulp.src(['dist/js/*.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

// 同步图片
gulp.task('copyImg', function() {

  gulp.src('src/img/*')
    .pipe(cached('copyImg'))
    .pipe(gulp.dest('public/img/'));
});

// 同步静态资源
gulp.task('copyStatic', function() {

  gulp.src('src/static/*')
    .pipe(cached('copyStatic'))
    .pipe(gulp.dest('public/static/'));
});


// 默认任务
gulp.task('default', ['watch']);

// 监听任务
gulp.task('watch', function() {

  // 建立浏览器自动刷新服务器
  browserSync.init({
    server: {
      // baseDir: "public"
      baseDir: "./"
    }
  });

  // 预处理 **表示各个层级
  gulp.watch('src/sass/**', ['sass']);

  // 同步静态文件
  gulp.watch('src/img/**', ['copyImg']);
  gulp.watch('src/static/**', ['copyStatic']);


  // 合并压缩
  gulp.watch('dist/css/*.css', ['concatCss']);
  gulp.watch('dist/js/*.js', ['concatJs']);

  // 自动刷新
  gulp.watch('public/**', function() {
    browserSync.reload();
  });

});