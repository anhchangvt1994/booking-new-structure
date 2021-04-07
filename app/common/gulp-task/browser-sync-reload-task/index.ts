import { gulp, browserSync } from '@common/define/module-define';

export default class BrowserSyncReloadTask {
  constructor() {};

  getTmp() {
    return {
      name: 'browserSyncReload',
      init:  function() {
        gulp.task('browserSyncReload', (cb) => {
          browserSync.reload(
            { stream: false }
          );

          cb();
        });
      }
    }
  }; // getTmp()
};
