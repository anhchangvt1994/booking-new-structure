import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class CopyImageTask {
  constructor() {};

  getTmp() {
    return {
      name: 'copyImageTmp',
      init: function() {
        modules.gulp.task('copyImageTmp', function() {
          return modules.gulp.src(APP.src.image + '/**/*.{jpg,png,gif,svg,ico}')
          .pipe(modules.plumber())
          .pipe(modules.cached('jpg,png,gif,svg,ico'))
          .pipe(modules.print(
            filepath => {
              return modules.ansiColors.green(`copy image: ${filepath}`);
            }
          ))
          .pipe(modules.copy(
            APP.tmp.image,
            {
              prefix: 2
              /*chúng ta có thể sử dụng gulp.dest để dẫn đến thư mục cần thiết, nếu chưa có thì auto tạo. Mục đích duy nhất để ta sử dụng prefix là để chúng ta xác định số cấp thư mục vào đến thư mục mà ta cần. Bắt đầu tính từ thư mục gốc
                vd: từ FADO_EMAIL-V2 vào dist/images thì phải qua 2 cấp thư mục dist/images
              */
            }
          ))
          // .pipe(modules.browserSync.reload({ stream: true }));
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'copyImageDist',
      init: function() {
        modules.gulp.task('copyImageDist', function() {
          return modules.gulp.src(APP.src.image + '/**/*.{jpg,png,gif,svg,ico}')
          .pipe(modules.imageMin([
            modules.imageMin.gifsicle({interlaced: true}),
            modules.imageMin.mozjpeg({quality: 80, progressive: true}),
            modules.imageMin.optipng({optimizationLevel: 5}),
          ]))
          .pipe(modules.gulp.dest(APP.dist.image));
        });
      }
    }
  }; // getDist()
};
