import modules from '@common/define/module-define';

export default class BrowserSyncReloadTask {
  constructor() {};

  getTmp() {
    return {
      name: 'browserSyncReload',
      init:  function() {
        modules.gulp.task('browserSyncReload', (cb) => {
          modules.browserSync.reload()
          cb();
        });
      }
    }
  }; // getTmp()
};
