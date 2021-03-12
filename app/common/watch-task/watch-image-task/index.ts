import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  WatchTaskStore
} from '@common/watch-task/store';
import {
  CopyImageTaskFormatted as CopyImageTask,
} from '@common/gulp-task/gulp-task-manager';

export default class WatchImageTask {
  constructor() {};

  get() {
    return {
      name: 'watchImage',
      init:  function() {
        WatchTaskStore.get(STATE_KEYS.group_watch_file)({
          'sourcePathUrl': APP.src.image + '/**/*.{jpg,png,gif,svg,ico}',
          'relativeTaskList': {
            'add': CopyImageTask.tmp.name,
          },
        });
      }
    }
  }; // get()
};
