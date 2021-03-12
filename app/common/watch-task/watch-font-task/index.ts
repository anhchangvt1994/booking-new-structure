import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  WatchTaskStore
} from '@common/watch-task/store';
import { CopyFontTaskFormatted as CopyFontTask } from '@common/gulp-task/gulp-task-manager';

export default class WatchFontTask {
  constructor() {};

  get() {
    return {
      name: 'watchFont',
      init:  function() {
        WatchTaskStore.get(STATE_KEYS.group_watch_file)({
          'source_path_url': APP.src.font + '/**/*.{svg,eot,otf,ttf,woff,woff2}',
          'relative_task_list': {
            'add': CopyFontTask.tmp.name,
          },
        });
      }
    }
  }; // get()
};
