import modules from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import {
  STATE_KEYS,
  ACTION_KEYS,
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

          return modules.gulp.src(APP.src.scss + '/**/*.{scss,css}')
          .pipe(
            modules.tap(
              function(file) {
                const filePath = file.path.replace(/\\/g, '/');

                modules.gulp.src(filePath)
                .pipe(modules.cached('scss'))
                .pipe(modules.dependents())
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

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                  }

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
                        'file-name': path.basename,
                        'file-path': APP.tmp.css + '/' + path.basename,
                      })
                    )
                  }

                  if(!GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                    // NOTE - Sau lần build đầu tiên sẽ tiến hành checkUpdateError
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).checkClearError(_isError, ARR_FILE_EXTENSION.CSS);
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                    GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();

                    _isError = false;

                    modules.fs.writeFile(APP.src.data + '/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                      if(err) throw err;

                      console.log('write file: "tmp-construct-log.json" finish.');
                    });
                  }
                }))
                .pipe(modules.gulp.dest(APP.tmp.css))
              }
            )
          )
        });
      }
    }
  }; // getTmp()

  getEndTmp() {
    return {
      name: 'sassEndTmp',
      init: function() {
        modules.gulp.task('sassEndTmp', function(cb) {
          cb();
        });
      }
    }
  }; // getEndTmp()

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
            .pipe(modules.sass({ outputStyle: 'compressed' }))
            .pipe(modules.rename(
              {
                'dirname' : '',
              }
            ))
            .pipe(modules.gulp.dest(APP.dist.css));
          }
        });
      }
    }
  }; // getDist()
};
