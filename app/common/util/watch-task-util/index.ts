import APP from '@common/enum/source-enum';
import { convertSassTask, copyImagesTask, copyFontsTask, compileJsTask, convertNunjuckTask, dummyData, browserSyncReloadTask } from '@common/util/gulp-task-util';
import gulp = require('gulp');
import del = require('del');
import path = require('path');

/* --------------------------------- INIT --------------------------------- */
browserSyncReloadTask.init();

/* --------------------------------- METHOD --------------------------------- */
//! ANCHOR - __groupWatchFiles
//-- Tạo ra method chứa những task watch có liên quan với nhau, dùng để xử lý 1 gulp task vd gulp task images hay gulp task fonts
interface arrRelativeTaskListConstruct {
  'add'?: string,
  'remove'?: Function,
  'other'?: any,
};

interface arrWatchFilesConfigConstruct {
  'sourcePathUrl': string | Array<string>,
  'relativeTaskList': arrRelativeTaskListConstruct,
};

const __groupWatchFiles = function(arrWatchFilesConfig: arrWatchFilesConfigConstruct) {
  //-- khi thêm files
  if(arrWatchFilesConfig.relativeTaskList.add) {
    gulp.watch(arrWatchFilesConfig.sourcePathUrl,
    {events : ['add','change']},
    gulp.series(
      arrWatchFilesConfig.relativeTaskList.add,
    ));
  }

  //-- khi xóa files
  const watchDelFiles = gulp.watch(arrWatchFilesConfig.sourcePathUrl);

  watchDelFiles.on('unlink', function(filepath) {
    const removeTask = arrWatchFilesConfig.relativeTaskList.remove;

    if(
      removeTask &&
      typeof removeTask === 'function'
    ) {
      removeTask(filepath);
    } else {
      const filePathFromSrc = path.relative(path.resolve('src'), filepath);
      const destFilePath = path.resolve(APP.tmp.path, filePathFromSrc);

      del.sync(destFilePath);

      if(typeof removeTask === 'string') {
        gulp.series(
          removeTask,
        );
      }
    }
  });
};

/* -------------------------------------------------------------------------- */


/* ---------------------------------- TASK ---------------------------------- */
//! ANCHOR - watchScssTask
//-- watch scss files change task
const _watchScssTask = function() {
  gulp.watch(APP.src.scss + '/**/*.scss', gulp.series(
    convertSassTask.tmp.name,
    browserSyncReloadTask.name,
  ));
};

export const watchScssTask = {
  'name': '',
  'init': _watchScssTask,
};

//! ANCHOR  - watchFontsTask
//-- watch font files change task
const _watchFontsTask = function() {
  __groupWatchFiles({
    'sourcePathUrl': APP.src.font + '/**/*.{svg,eot,otf,ttf,woff,woff2}',
    'relativeTaskList': {
      'add': copyFontsTask.tmp.name,
    },
  });
};

//! ANCHOR  - watchJsTask
//-- watch js files change task
const _watchJsTask = function() {
  gulp.watch([APP.src.js + '/**/*.js', APP.src.js + '/**/component/*.vue'], gulp.series(
    compileJsTask.tmp.name,
    browserSyncReloadTask.name,
  ));

  __groupWatchFiles({
    'sourcePathUrl': [APP.src.js + '/**/*.js', APP.src.js + '/**/component/*.vue'],
    'relativeTaskList': {
      'remove': function(filePath) {
        let filename = filePath.split('\\').slice(-2)[1];
        const foldername = filePath.split('\\').slice(-2)[0];

        if(filename == 'index.js') {
          filename = foldername + '.js';
          const destFilePath = path.resolve(APP.tmp.path, 'js\\' + filename);

          del.sync(destFilePath);
        }

        compileJsTask.dependent.removeDependentFiles(filename);
      },
    },
  });
};

export const watchJsTask = {
  'name': '',
  'init': _watchJsTask,
};

//! ANCHOR  - watchNunjuckTask
//-- watch njk files change task
const _watchNunjuckTask = function() {
  gulp.watch(APP.src.njk + '/**/*.njk', gulp.series(
    convertNunjuckTask.tmp.name,
    browserSyncReloadTask.name,
  ));

  __groupWatchFiles({
    'sourcePathUrl': APP.src.njk + '/**/*.njk',
    'relativeTaskList': {
      'remove': function(filePath) {
        let filename = filePath.split('\\').slice(-2)[1];
        const foldername = filePath.split('\\').slice(-2)[0];

        if(filename == 'index.njk') {
          filename = foldername + '.html';
          const destFilePath = path.resolve(APP.tmp.path, filename);
          console.log(destFilePath);

          del.sync(destFilePath);
        }

        convertNunjuckTask.dependent.removeDependentFiles(filename);
      },
    },
  });
};

export const watchNunjuckTask = {
  'name': '',
  'init': _watchNunjuckTask,
};

//! ANCHOR - watchDummyData
const _watchDummyData = function() {
  gulp.watch(APP.src.dummy_data + '/data-store/*.json', gulp.series(
    dummyData.tmp.name,
    browserSyncReloadTask.name,
  ))
};

//! ANCHOR  - watchImagesTask
//-- watch image files change task
const _watchImagesTask = function() {
  __groupWatchFiles({
    'sourcePathUrl': APP.src.image + '/**/*.{jpg,png,gif,svg,ico}',
    'relativeTaskList': {
      'add': copyImagesTask.tmp.name,
    },
  });
};

export const watchImagesTask = {
  'name': '',
  'init': _watchImagesTask,
};

//! ANCHOR  - watchTmpTask
//? watch tmp files change task (with template njk)
const _watchTmpWithTemplateTask = function() {
  gulp.task('watch-tmp-with-template', function() {
    _watchScssTask();
    // _watchFontsTask();
    _watchJsTask();
    _watchNunjuckTask();
    _watchDummyData();
    // _watchImagesTask();
  });
};

//? watch tmp files change task (with template njk)
const _watchTmpWithoutTemplateTask = function() {
  gulp.task('watch', function() {
    _watchScssTask();
    // _watchFontsTask();
    _watchJsTask();
    // _watchImagesTask();
  });
};

export const watchTask = {
  'tmp_with_template': {
    'name': 'watch-tmp-with-template',
    'init': _watchTmpWithTemplateTask,
  },
  'tmp': {
    'name': 'watch',
    'init': _watchTmpWithoutTemplateTask,
  },
};
/* -------------------------------------------------------------------------- */
