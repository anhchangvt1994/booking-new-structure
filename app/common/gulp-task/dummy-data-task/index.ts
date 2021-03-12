import { isEmpty as _isEmpty } from 'lodash';

import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import EVN_APPLICATION from '@common/define/enviroment-define';
import {
  RESOURCE,
  BASE_STATIC_URL
} from '@common/config/resource-config';

export default class DummyDataTask {
  constructor() {};

  getTmp() {
    return {
      name: 'dummyData',
      init:  function() {
        modules.gulp.task('dummyData', function() {
          let _isError = false;

          // NOTE - Define enviroment method for nunjucks render
          const _manageEnviroment = function(env) {
            env.addFilter('json', function (value, spaces) {
              if (value instanceof modules.nunjucksRender.nunjucks.runtime.SafeString) {
                value = value.toString();
              }
              const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c');
              return modules.nunjucksRender.nunjucks.runtime.markSafe(jsonString);
            })
          };

          const _DUMMY_FILE_PATH = [
            APP.src.dummy_data + '/data-store/*.json'
          ];

          return modules.gulp.src(_DUMMY_FILE_PATH)
          .pipe(modules.cached('.json'))
          .pipe(modules.tap(function(file) {
            if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
              return;
            }

            let filePath = file.path.replace(/\\/g, '/');

            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
            const filename = filePath.split('/').slice(-2)[1].replace('.json','');

            filePath = APP.src.njk + '/template/' + filename + '.' + ARR_FILE_EXTENSION.NJK;

            modules.gulp.src(filePath)
            .pipe(modules.print(
              filepath => {
                return modules.ansiColors.yellow(`convert njk: ${filepath}`);
              }
            ))
            .pipe(modules.data(() => {
              let responseData:any = {};

              if(RESOURCE.resource[filename]?.dummy_data) {
                responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(filename) || {};
              }

              if(
                !_isEmpty(responseData) &&
                !responseData.success
              ) {
                _isError = true;

                GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(responseData, ARR_FILE_EXTENSION.JSON, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));

                if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                  GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                }
              } else {
                GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JSON, filename + '.' + ARR_FILE_EXTENSION.JSON);
              }

              responseData = (_isError ? {} : responseData.data);

              return {
                file: filePath.split('/')[filePath.split('/').length - 2],
                namepage: filePath.split('/')[filePath.split('/').length - 2],
                data: responseData,
                CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version),
                EVN_APPLICATION: EVN_APPLICATION.dev,
                LAYOUT_CONFIG: {
                  'imageUrl' : BASE_STATIC_URL + '/image', // NOTE - Vì image sử dụng trong layout config cho những file render numjuck sang html thường có dạng '{{ LAYOUT_CONFIG.imageUrl }}/fantasy-image08.jpg' nên để dev tự thêm / sẽ clear hơn khi sử dụng với nunjuck
                  'cssUrl' : BASE_STATIC_URL + '/tmp/css/',
                  'jsUrl' : BASE_STATIC_URL + '/tmp/js/',
                }
              }
            }))
            .pipe(modules.nunjucksRender({
              ext: '.html',
              data: {
                objGlobal: RESOURCE,
                intRandomNumber : Math.random() * 10
              },
              manageEnv: _manageEnviroment,
            }))
            .on('error', function(err) {
              this.emit('end');
            })
            .pipe(modules.rename(function(path) {
              path.basename = filename;

              // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
              if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                const strErrKey = path.basename + '.' + ARR_FILE_EXTENSION.NJK;
                // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.NJK, strErrKey);
                GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                _isError = false;
              }
            }))
            .pipe(modules.gulp.dest(APP.tmp.path))
          }));
        })
      }
    }
  }; // getTmp()
};
