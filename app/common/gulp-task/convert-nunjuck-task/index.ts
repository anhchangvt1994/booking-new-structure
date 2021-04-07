import { isEmpty as _isEmpty } from 'lodash';

import modules, { browserSync } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  ACTION_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import {
  RESOURCE,
  BASE_STATIC_URL
} from '@common/config/resource-config';
import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';

export default class ConvertNunjuckTask {
  constructor() {};

  getTmp() {
    return {
      name: 'njkTmp',
      init:  function() {
        modules.gulp.task('njkTmp', function() {
          let _isError = false;

          let _curFilePath = null;
          let _newestFilePath = null;

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

          return modules.gulp.src(APP.src.njk + '/**/*.njk')
          .pipe(modules.cached('.njk'))
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');

            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file njk phía tmp
            const filename = filePath.split('/').slice(-2)[1];
            const foldername = filePath.split('/').slice(-2)[0];

            let filePathData = null;

            if(foldername === 'template') {
              // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent sẽ update lại các dependents file của file index đó
              filePathData = GulpTaskStore.get(STATE_KEYS.njk_dependents).generate({
                'folder-name': filename,
                'path': file.path,
                'file-name': 'index.njk',
                'content': file.contents,
              });
            } else {
              filePathData = GulpTaskStore.get(STATE_KEYS.njk_dependents).generate({
                'folder-name': foldername,
                'file-name': filename,
                'content': file.contents,
              });
            }

            if(
              filePathData &&
              filePathData.length > 0
            ) {
              filePathData.forEach(function(filePath) {
                filePath = filePath.replace(/\\/g, '/');
                _newestFilePath = filePath;

                let filename = filePath.split('/').slice(-2)[1];

                filename = filename.replace('.njk', '');

                modules.gulp.src(filePath)
                .pipe(modules.print(
                  filepath => {
                    return modules.ansiColors.yellow(`convert njk: ${filepath}`);
                  }
                ))
                .pipe(modules.data((file) => {
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

                    // if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    //   GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                    // }
                  } else {
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JSON, filename + '.' + ARR_FILE_EXTENSION.JSON);
                  }

                  responseData = (_isError ? {} : responseData.data);

                  return {
                    file: filename,
                    namepage: filename,
                    data: responseData,
                    CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version),
                    ENV_APPLICATION: process.env.NODE_ENV,
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
                  _isError = true;
                  GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(err, ARR_FILE_EXTENSION.NJK, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));

                  // if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                  //   GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                  // }

                  this.emit('end');
                })
                .pipe(modules.rename(function(path) {
                  path.basename = filename;
                  // NOTE Nếu construct HTML đối với path file name hiện tại đang rỗng thì nạp vào
                  if(!GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.HTML][path.basename]) {
                    GulpTaskStore.dispatch(ACTION_KEYS.generate_tmp_construct, generateTmpDirItemConstruct({
                      'file-name': path.basename,
                      'file-path': APP.tmp.path + '/' + path.basename,
                    }));
                  }

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                      if(err) throw err;

                      console.log('write file: "tmp-construct-log.json" finish.');
                    });
                  }
                }))
                .pipe(modules.gulp.dest(APP.tmp.path))
                .on('end', function() {
                  _curFilePath = filePath;

                  if(_curFilePath === _newestFilePath) {
                    if(!GulpTaskStore.get(STATE_KEYS.is_njk_finish)) {
                      if(GulpTaskStore.get(STATE_KEYS.njk_dependents).isFirstCompile) {
                        GulpTaskStore.get(STATE_KEYS.njk_dependents).isFirstCompile = false;
                      }

                      GulpTaskStore.commit(MUTATION_KEYS.set_is_njk_finish, true);
                    } else {
                      // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                      if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                        const strErrKey = filename + '.' + ARR_FILE_EXTENSION.NJK;
                        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.NJK, strErrKey);
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                        _isError = false;
                      }

                      browserSync.reload(
                        { stream: false }
                      );
                    }
                  }
                });
              });
            }
          }));
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'njkDist',
      init: function() {
        modules.gulp.task('njkDist', function() {
          const _manageEnviroment = function(env) {
            env.addFilter('json', function (value, spaces) {
              if (value instanceof modules.nunjucksRender.nunjucks.runtime.SafeString) {
                value = value.toString()
              }
              const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c')
              return modules.nunjucksRender.nunjucks.runtime.markSafe(jsonString)
            })
          };

          const _NJK_COMPILE_FILE_LIST = [
            APP.src.njk + '/template/**/*.njk',
          ];

          return modules.gulp.src(_NJK_COMPILE_FILE_LIST)
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');

            let filename = filePath.split('/').slice(-2)[1];

            filename = filename.replace('.njk', '');

            modules.gulp.src(filePath)
            .pipe(modules.data(() => {
              let responseData:any = {};

              if(RESOURCE.resource[filename]?.dummy_data) {
                responseData = GulpTaskStore.get(STATE_KEYS.dummy_data_manager).get(filename) || {};
              }

              responseData = (!responseData.success ? {} : responseData.data);

              return {
                file: filename,
                namepage: filename,
                data: responseData,
                CACHE_VERSION: GulpTaskStore.get(STATE_KEYS.update_version),
                ENV_APPLICATION: process.env.NODE_ENV,
                LAYOUT_CONFIG: {
                  'imageUrl' : BASE_STATIC_URL + '/image',
                  'cssUrl' : BASE_STATIC_URL + '/css/',
                  'jsUrl' : BASE_STATIC_URL + '/js/',
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
            .pipe(modules.rename(function(path) {
                path.basename = filename;
              }
            ))
            .pipe(modules.print(
              filepath => `built: ${filepath}`
            ))
            .pipe(modules.gulp.dest(APP.dist.path));
          }));
        });
      }
    }
  }; // getDist()
};
