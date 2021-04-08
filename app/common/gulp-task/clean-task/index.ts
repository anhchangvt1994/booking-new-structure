import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class CleanTask {
  constructor() {};

  getTmp() {
    return {
      name: 'cleanTmp',
      init: function() {
        modules.gulp.task('cleanTmp', function() {
          return modules.gulp.src([
            APP.tmp.path,
            APP.log.path + '/tmp-construct/*.json'
          ], {read: true, allowEmpty: true})
          .pipe(modules.clean({ force: true }));
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'cleanDist',
      init: function() {
        modules.gulp.task('cleanDist', function() {
          return modules.gulp.src(APP.dist.path, {read: false, allowEmpty: true})
          .pipe(modules.clean({ force: true }));
        });
      }
    }
  }; // getDist()
};
