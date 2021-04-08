import { isEmpty as _isEmpty } from 'lodash';

import modules, { browserSync } from '@common/define/module-define';
import {
  RESOURCE,
} from '@common/config/resource-config';
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
          let _onTaskFinish = setInterval(function() {

            if(
              GulpTaskStore.get(STATE_KEYS.is_njk_finish) &&
              GulpTaskStore.get(STATE_KEYS.is_sass_finish) &&
              GulpTaskStore.get(STATE_KEYS.is_js_finish)
            ) {
              browserSync.init({
                reloadDelay: 0, // Fix htmlprocess watch not change
                reloadOnRestart: true,
                open: false, // Stop auto open browser
                cors: false,
                port: RESOURCE.port,
                host: RESOURCE.ip_address,
                injectChanges: false,
                notifier: {
                  styles: [
                    "display: none; ",
                    "padding: 5px 5px;",
                    "position: fixed;",
                    "font-size: 1.75rem;",
                    "line-height: 18px;",
                    "z-index: 999999;",
                    "left: 0;",
                    "top: 0;",
                    "width: auto;",
                    "max-width: 100%",
                    "color: #fff;",
                    "background-color: rgba(0,0,0,0.5);",
                    "box-shadow: 0 0 5px rgba(0,0,0,0.3);"
                  ]
                },
                server: {
                  baseDir: APP.lab.path,
                  index: "/tmp/home-page.html",

                  // NOTE - Dùng để config khi sử dụng SPA
                  middleware: function(req, res, next) {
                    if(!req.url.match(/\/image|\/font|\/js|\/css/img)) {
                      req.url = '/tmp/index.html';
                    }

                    return next();
                  },
                },

                callbacks: {
                  /**
                   * This 'ready' callback can be used
                   * to access the Browsersync instance
                   */
                  ready: function(err, bs) {
                    if(GulpTaskStore.get(STATE_KEYS.is_first_compile_all)) {
                      browserSync.reload(
                        { stream: false }
                      );

                      // NOTE Sau khi build xong lượt đầu thì forEach để in error ra nếu có
                      if(GulpTaskStore.get(STATE_KEYS.handler_error_util).arrError) {
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).reportError();
                        GulpTaskStore.get(STATE_KEYS.handler_error_util).notifSuccess();
                      }

                      GulpTaskStore.commit(MUTATION_KEYS.set_is_browser_sync_finish, true);

                      // NOTE ghi nhận lượt buid đầu tiên đã xong
                      GulpTaskStore.commit(MUTATION_KEYS.set_is_first_compile_all, false);

                      modules.fs.writeFile(APP.log.path + '/tmp-construct/tmp-construct-log.json', JSON.stringify(GulpTaskStore.get(STATE_KEYS.tmp_construct)), (err) => {
                        if(err) throw err;

                        console.log('write file: "tmp-construct-log.json" finish.');
                      });
                    }
                  }
                }
              }); // end modules.browserSync

              clearInterval(_onTaskFinish);
            }
          }, 300);

          cb();
        });
      }
    }
  }; // getTmp()
};
