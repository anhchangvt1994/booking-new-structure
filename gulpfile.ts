import 'tsconfig-paths/register';
import gulp = require('gulp');

import {
  CleanTaskFormatted as CleanTask,
  CopyImageTaskFormatted as CopyImageTask,
  CopyFontTaskFormatted as CopyFontTask,
  ConvertSassTaskFormatted as ConvertSassTask,
  PrettierCssTaskFormatted as PrettierCssTask,
  CompileJsTaskFormatted as CompileJsTask,
  ConvertNunjuckTaskFormatted as ConvertNunjuckTask,
  PrettierHtmlTaskFormatted as PrettierHtmlTask,
  DummyDataTaskFormatted as DummyDataTask,
  DoAfterBuildTaskFormatted as DoAfterBuildTask,
} from '@common/gulp-task/gulp-task-manager';

import {
  WatchTmpWithTemplateTask,
  WatchTmpWithoutTemplateTask
} from '@common/watch-task/watch-task-manager';

//! ANCHOR - CleanTask
//-- clean tmp task
CleanTask.tmp.init();

//-- clean dist task
CleanTask.dist.init();

//! ANCHOR - ConvertSassTask
//-- convert sass to css into tmp
ConvertSassTask.tmp.init();

//-- convert sass to css into dist
ConvertSassTask.dist.init();

//! ANCHOR - PrettierCssTask
//-- prettier css in dist
//? chỉ sử dụng prettier css cho source css trong thư mục tmp
PrettierCssTask.tmp.init();

//! ANCHOR - CompileJsTask
//-- compile js into tmp
CompileJsTask.tmp.init();

//-- compile js into dist
CompileJsTask.dist.init();

//! ANCHOR - CopyFontTask
//-- copy fonts to dist
CopyFontTask.dist.init();

//! ANCHOR - ConvertNunjuckTask
//-- convert nunjuck to html into tmp
ConvertNunjuckTask.tmp.init();

//-- convert nunjuck to html into dist
ConvertNunjuckTask.dist.init();

//! ANCHOR - PrettierHtmlTask
//-- prettier html tmp
PrettierHtmlTask.tmp.init();

//! ANCHOR - DummyDataTask
//-- init dummy data
DummyDataTask.tmp.init();

//-- prettier html dist
PrettierHtmlTask.dist.init();

//! ANCHOR - CopyImageTask
//-- copy images to dist
CopyImageTask.dist.init();

//! ANCHOR  - watchTask
//-- watch tmp files change task (with template njk)
WatchTmpWithTemplateTask.init();

//-- watch tmp files change task (without template njk)
WatchTmpWithoutTemplateTask.init();

//! ANCHOR - DoAfterBuildTask.tmp
//-- doAfterBuild task
DoAfterBuildTask.tmp.init();

//! ANCHOR - task runner
//-- dev script
//? build tmp with template njk
gulp.task('dev:template', gulp.series(
  CleanTask.tmp.name,
  gulp.parallel(
    ConvertSassTask.tmp.name,

    gulp.series(
      DummyDataTask.tmp.name,
      ConvertNunjuckTask.tmp.name,
    ),
  ),

  CompileJsTask.tmp.name,

  DoAfterBuildTask.tmp.name,

  // WatchTmpWithTemplateTask.name,
));

//? build tmp without layout njk
gulp.task('dev', gulp.series(
  CleanTask.tmp.name,

  ConvertSassTask.tmp.name,

  CompileJsTask.tmp.name,

  DoAfterBuildTask.tmp.name,

  gulp.parallel(
    WatchTmpWithoutTemplateTask.name,
  )
));

//-- prod script
//? build production
gulp.task('prod', gulp.series(
  gulp.parallel(
    CleanTask.dist.name,
  ),

  gulp.parallel(
    ConvertNunjuckTask.dist.name,
    ConvertSassTask.dist.name,
    CopyFontTask.dist.name,
    CopyImageTask.dist.name,
  ),

  CompileJsTask.dist.name,

  PrettierHtmlTask.dist.name,
));
