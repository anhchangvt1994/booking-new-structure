import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';

export default class PrettierCssTask {
  constructor() {};

  getTmp() {
    return {
      name: 'prettierCssTmp',
      init: function() {
        modules.gulp.task('prettierCssTmp', function() {
          return modules.gulp.src(APP.tmp.css + '*.css')
          .pipe(modules.cached('scss'))
          .pipe(modules.dependents())
          .pipe(modules.prettier({
            singleQuote: true
          }))
          .pipe(modules.print(
            filepath => `prettier css: ${filepath}`
          ))
          .pipe(modules.gulp.dest(APP.tmp.css))
        });
      }
    }
  }; // getTmp()
};
