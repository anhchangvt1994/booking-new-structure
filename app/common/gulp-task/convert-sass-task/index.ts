import modules, { browserSync } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  ACTION_KEYS,
  MUTATION_KEYS,
  GulpTaskStore,
} from '@common/gulp-task/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import { generateTmpDirItemConstruct } from '@common/enum/tmp-directory-enum';

export default class ConvertSassTask {
  constructor() {};

  getTmp() {
    return {
      name: 'sassTmp',
      init:  function() {
        modules.gulp.task('sassTmp', function() {
          let _isError = false;

          let _curFilePath = null;
          let _newestFilePath = null;

          return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
          .pipe(modules.cached('scss'))
          .pipe(modules.dependents())
          .pipe(
            modules.tap(
              function(file) {
                const filePath = file.path.replace(/\\/g, '/');

                _newestFilePath = filePath;

                modules.gulp.src(filePath)
                .pipe(modules.print(
                  (filepath) => {
                    if(filepath.indexOf('_env.scss') !== -1) {
                      return modules.ansiColors.blueBright(`update new sass cache version: ${GulpTaskStore.get(STATE_KEYS.update_version)}`);
                    }

                    return modules.ansiColors.yellow(`compile sass: ${filepath}`);
                  }
                ))
                .pipe(modules.sassVars({
                  '$var-cache-version': GulpTaskStore.get(STATE_KEYS.update_version),
                }))
                .pipe(modules.dartSass.sync(
                  {
                    errLogToConsole: false,
                  }
                ))
                .on('error', function(err) {
                  _isError = true;
                  GulpTaskStore.get(STATE_KEYS.handler_error_util).handlerError(
                    err,
                    ARR_FILE_EXTENSION.CSS,
                    GulpTaskStore.get(STATE_KEYS.is_first_compile_all)
                  );

                  // if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                  //   GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                  // }

                  this.emit('end');
                })
                .pipe(modules.rename(function(path) {
                  // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
                  path.dirname = '';
                  path.basename+='-style';

                  // NOTE Nếu construct CSS đối với path file name hiện tại đang rỗng thì nạp vào
                  if(!GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.CSS][path.basename]) {
                    GulpTaskStore.dispatch(
                      ACTION_KEYS.generate_tmp_construct,
                      generateTmpDirItemConstruct({
                        extension: ARR_FILE_EXTENSION.CSS,
                        file_name: path.basename,
                        file_path: APP.tmp.css + '/' + path.basename,
                      })
                    )
                  }

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                      if(err) throw err;

                      console.log('write file: "tmp-construct-log.json" finish.');
                    });
                  }
                }))
                .pipe(modules.gulp.dest(APP.tmp.css))
                .on('end', function() {
                  _curFilePath = filePath;

                  if(_curFilePath === _newestFilePath) {
                    if(!GulpTaskStore.get(STATE_KEYS.is_sass_finish)) {
                      GulpTaskStore.commit(MUTATION_KEYS.set_is_sass_finish, true);
                    } else {
                      if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                        // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.CSS);
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
              }
            )
          )
        });
      }
    }
  }; // getTmp()

  getDist() {
    return {
      name: 'sassDist',
      init: function() {
        modules.gulp.task('sassDist', function() {
          if(GulpTaskStore.get(STATE_KEYS.tmp_construct)[ARR_FILE_EXTENSION.CSS]) {
            return GulpTaskStore.get(STATE_KEYS.move_file)({
              'sourcePathUrl': APP.tmp.css + '/*.' + ARR_FILE_EXTENSION.CSS,
              'targetPathUrl': APP.dist.css,
              'compressModule': modules.cleanCss({compatibility: 'ie8'}),
            });
          } else {
            return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
            .pipe(modules.plumber())
            .pipe(modules.dartSass({ outputStyle: 'compressed' }))
            .pipe(modules.rename(function(path) {
              // NOTE đưa tất cả các file về cấp folder root của nó (ở đây là css)
              path.dirname = '';
              path.basename+='-style';
            }))
            .pipe(modules.gulp.dest(APP.dist.css));
          }
        });
      }
    }
  }; // getDist()
};
