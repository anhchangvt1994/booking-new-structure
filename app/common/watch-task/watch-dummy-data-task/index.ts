import gulp = require('gulp');

import APP from '@common/enum/source-enum';
import {
  DummyDataTaskFormatted as DummyDataTask,
  // BrowserSyncReloadTaskFormatted as BrowserSyncReloadTask
} from '@common/gulp-task/gulp-task-manager';

// NOTE - Khởi tạo BrowserSyncReloadTask
// BrowserSyncReloadTask.tmp.init();

export default class WatchDummyDataTask {
  constructor() {};

  get() {
    return {
      name: 'watchDummyData',
      init:  function() {
        gulp.watch(APP.src.dummy_data + '/data-store/*.json', gulp.series(
          DummyDataTask.tmp.name,
          // BrowserSyncReloadTask.tmp.name,
        ))
      }
    }
  }; // get()
};
