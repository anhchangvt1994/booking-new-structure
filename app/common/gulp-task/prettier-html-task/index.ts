import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class PrettierHtmlTask {
  constructor() {};

  getTmp() {
    return {
      name: 'prettierHtmlTmp',
      init:  function() {
        modules.gulp.task('prettierHtmlTmp', function() {
          return modules.gulp.src(APP.tmp.path + '*.html')
          .pipe(modules.prettier({
            singleQuote: true
          }))
          .pipe(modules.gulp.dest(APP.tmp.path))
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'prettierHtmlDist',
      init: function() {
        modules.gulp.task('prettierHtmlDist', function() {
          return modules.gulp.src(APP.dist.path + '*.html')
          .pipe(modules.prettier({
            singleQuote: true
          }))
          .pipe(modules.gulp.dest(APP.dist.path))
        });
      }
    }
  }; // getDist()
};
