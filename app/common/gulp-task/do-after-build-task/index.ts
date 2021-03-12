import { isEmpty as _isEmpty } from 'lodash';

import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';

export default class DoAfterBuildTask {
  constructor() {};

  getTmp() {
    return {
      name: 'doAfterBuildTask',
      init:  function() {
        modules.gulp.task('doAfterBuildTask', function(cb) {
          // NOTE ghi nhận lượt buid đầu tiên đã xong
          GulpTaskStore.commit(MUTATION_KEYS.set_is_first_compile_all, false);

          // NOTE ghi file "tmp-construct-log.json" sau khi lượt build task đầu tiên hoàn thành
          modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
            if(err) throw err;

            console.log('write file: "tmp-construct-log.json" finish.');
          });

          // NOTE Sau khi build xong lượt đầu thì forEach để in error ra nếu có
          if(GulpTaskStore.get(STATE_KEYS.handler_error_util).arrError) {
            setTimeout(function() {
              GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
              GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
            }, 1500);
          }

          cb();
        });
      }
    }
  }; // getTmp()
};
