import { isEmpty as _isEmpty, forIn as _forIn } from 'lodash';

import modules, { browserSync, uglify } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  ACTION_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';

export default class ComipleJsTask {
  constructor() {};

  getTmp() {
    return {
      name: 'jsTmp',
      init:  function() {
        modules.gulp.task('jsTmp', function() {
          let _isError = false;
          let _arrJsErrorFileList = [];

          let _curFilePath = null;
          let _newestFilePath = null;

          return modules.gulp.src([
            APP.src.js + '/**/*.js',
            APP.src.js + '/**/component/**/*.vue']
          )
          .pipe(modules.plumber({
            'errorHandler': function(err) {
              _arrJsErrorFileList.push(err.fileName);
            },
          }))
          .pipe(modules.cached('.js'))
          .pipe(modules.eslint())
          .pipe(modules.eslint.result(function(result) {
            if(result.warningCount > 0 || result.errorCount > 0) {
              _isError = true;

              const errorMessage = result.messages[0];

              GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError({
                plugin: 'gulp-eslint',
                lineNumber: errorMessage.line,
                fileName: result.filePath,
                message: errorMessage.message
              }, ARR_FILE_EXTENSION.JS, GulpTaskStore.get(STATE_KEYS.is_first_compile_all));
            }
          }))
          .pipe(modules.tap(function(file) {
            const filePath = file.path.replace(/\\/g, '/');
            // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
            const filename = filePath.split('/').slice(-2)[1];
            const foldername = filePath.split('/').slice(-2)[0];

            let filePathData = null;

            if(
              filename === 'index.js' ||
              foldername === 'js'
            ) {
              // NOTE Khi một file index thay đổi thì nó sẽ tự build lại, nên trong xử lý dependent chỉ update lại các dependents file của file index đó, chứ hok return ra mảng index cần build lại
              filePathData = GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                'folder-name': foldername,
                'path': file.path,
                'file-name': filename,
                'content': file.contents,
              });
            } else {
              filePathData = GulpTaskStore.get(STATE_KEYS.js_dependents).generate({
                'folder-name': foldername,
                'file-name': filename,
                'content': file.contents,
              });
            }

            if(filePathData) {
              filePathData.forEach(function(strFilePath) {
                strFilePath = strFilePath.replace(/\\/g, '/');
                _newestFilePath = strFilePath;

                let filename = strFilePath.split('/').slice(-2)[1];
                const foldername = strFilePath.split('/').slice(-2)[0];

                filename = (foldername!=='js' ? foldername : filename.replace('.js', ''));

                modules.browserify({ entries: [strFilePath] }) // path to your entry file here
                .transform(modules.vueify, {
                  "presets": ["@babel/preset-env"],
                })
                .transform(modules.babelify, {
                  "presets": ["@babel/preset-env"],
                })
                .transform("aliasify")
                .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
                .bundle()
                .pipe(modules.source(filename + '.' + ARR_FILE_EXTENSION.JS))
                .pipe(modules.print(
                  filepath => {
                    return modules.ansiColors.yellow(`compile js: ${filepath}`);
                  }
                ))
                .pipe(modules.rename(function() {
                  // NOTE Nếu construct JS đối với path file name hiện tại đang rỗng thì nạp vào
                  if(!GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.JS][filename]) {
                    GulpTaskStore.dispatch(ACTION_KEYS.generate_tmp_construct, generateTmpDirItemConstruct({
                      extension: ARR_FILE_EXTENSION.JS,
                      file_name: filename,
                      file_path: APP.tmp.js + '/' + filename,
                    }));
                  }

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                      if(err) throw err;

                      console.log('write file: "tmp-construct-log.json" finish.');
                    });
                  }
                }))
                .pipe(modules.buffer())
                .on('error', function() {
                  this.emit('end');
                })
                .pipe(
                  modules.gulp.dest(APP.tmp.js)
                )
                .on('end', function() {
                  _curFilePath = strFilePath;

                  if(_curFilePath === _newestFilePath) {
                    if(!GulpTaskStore.get(STATE_KEYS.is_js_finish)) {
                      // NOTE Đánh dấu lượt compile đầu tiên đã hoàn thành
                      if(GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile) {
                        GulpTaskStore.get(STATE_KEYS.js_dependents).isFirstCompile = false;
                      }

                      GulpTaskStore.commit(MUTATION_KEYS.set_is_js_finish, true);
                    } else {
                      const strErrKey = (filename === 'index.js' ? foldername + '.js' : filename);

                      if(GulpTaskStore.get(STATE_KEYS.is_js_finish)) {
                        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.JS, strErrKey);
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
          }))
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'jsDist',
      init: function() {
        modules.gulp.task('jsDist', function() {
          if(!_isEmpty(GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.JS])) {
            return GulpTaskStore.get(STATE_KEYS.move_file)(
              {
                'sourcePathUrl': APP.tmp.js + '/*.' + ARR_FILE_EXTENSION.JS,
                'targetPathUrl': APP.dist.js,
                'compressModule': uglify({
                  compress: {
                    // sequences     : true,  // join consecutive statemets with the “comma operator”
                    // properties    : true,  // optimize property access: a["foo"] → a.foo
                    // dead_code     : true,  // discard unreachable code
                    // drop_debugger : true,  // discard “debugger” statements
                    // unsafe        : false, // some unsafe optimizations (see below)
                    // conditionals  : true,  // optimize if-s and conditional expressions
                    // comparisons   : true,  // optimize comparisons
                    // evaluate      : true,  // evaluate constant expressions
                    // booleans      : true,  // optimize boolean expressions
                    // loops         : true,  // optimize loops
                    // unused        : true,  // drop unused variables/functions
                    // hoist_funs    : true,  // hoist function declarations
                    // hoist_vars    : false, // hoist variable declarations
                    // if_return     : true,  // optimize if-s followed by return/continue
                    // join_vars     : true,  // join var declarations
                    // side_effects  : true,  // drop side-effect-free statements
                    // global_defs   : {}     // global definitions
                    sequences: true,
                    properties: true,
                    dead_code: true,
                    drop_debugger: true,
                    comparisons: true,
                    conditionals: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: true,
                    drop_console: true
                  }
                }),
              }
            );
          } else {
            const _JS_COMPILE_FILE_LIST = [
              APP.src.js + '/vendor.js',
              APP.src.js + '/**/index.js',
            ];

            return modules.gulp.src(_JS_COMPILE_FILE_LIST)
            .pipe(modules.tap(function(file) {
              const filePath = file.path.replace(/\\/g, '/');
              // NOTE split file.path và lấy tên file cùng tên folder để rename đúng tên cho file js phía tmp
              let filename = filePath.split('/').slice(-2)[1];
              const foldername = filePath.split('/').slice(-2)[0];

              filename = (foldername!=='js' ? foldername : filename.replace('.js', ''));

              modules.browserify({ entries: [filePath] }) // path to your entry file here
              .transform(modules.vueify)
              .transform(modules.babelify, {
                "presets": ["@babel/preset-env"],
              })
              .transform("aliasify")
              // .plugin('tinyify')
              .external('vue') // remove vue from the bundle, if you omit this line whole vue will be bundled with your code
              .bundle()
              .pipe(modules.source(filename + '.' + ARR_FILE_EXTENSION.JS))
              .pipe(modules.print(
                filepath => {
                  return modules.ansiColors.yellow(`compile js: ${filepath}`);
                }
              ))
              .pipe(modules.buffer())
              .pipe(uglify({
                compress: {
                  sequences: true,
                  properties: true,
                  dead_code: true,
                  drop_debugger: true,
                  comparisons: true,
                  conditionals: true,
                  evaluate: true,
                  booleans: true,
                  loops: true,
                  unused: true,
                  hoist_funs: true,
                  if_return: true,
                  join_vars: true,
                  negate_iife: true,
                  drop_console: true
                }
              }))
              .pipe(
                modules.gulp.dest(APP.dist.js)
              );
            }))
          }
        });
      }
    }
  }; // getDist()
};
