import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class CopyFontTask {
  constructor() {};

  getTmp() {
    return {
      name: 'copyFontTmp',
      init:  function() {
        modules.gulp.task('copyFontTmp', function() {
          return modules.gulp.src(APP.src.font + '/**/*.{svg,eot,otf,ttf,woff,woff2}')
          .pipe(modules.cached('fonts'))
          .pipe(modules.print((filepath) => {
            return modules.ansiColors.green(`copy font: ${filepath}`);
          }))
          .pipe(modules.copy(
            APP.tmp.font,
            {
              prefix: 2
            }
          ))
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'copyFontDist',
      init: function() {
        modules.gulp.task('copyFontDist', function() {
          return modules.gulp.src(APP.src.font + '/**/*.{svg,eot,otf,ttf,woff,woff2}')
          .pipe(modules.cached('fonts'))
          .pipe(modules.print((filepath) => {
            return modules.ansiColors.green(`copy font: ${filepath}`);
          }))
          .pipe(modules.copy(
            APP.dist.font,
            {
              prefix: 2
            }
          ))
        });
      }
    }
  }; // getDist()
};
