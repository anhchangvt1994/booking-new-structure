import { isEmpty as _isEmpty } from 'lodash';

import './store-init';
import CleanTask from '@common/gulp-task/clean-task';
import CopyImageTask from '@common/gulp-task/copy-image-task';
import CopyFontTask from '@common/gulp-task/copy-font-task';
import ConvertSassTask from '@common/gulp-task/convert-sass-task';
import PrettierCssTask from '@common/gulp-task/prettier-css-task';
import CompileJsTask from '@common/gulp-task/compile-js-task';
import ConvertNunjuckTask from '@common/gulp-task/convert-nunjuck-task';
import PrettierHtmlTask from '@common/gulp-task/prettier-html-task';
import DummyDataTask from '@common/gulp-task/dummy-data-task';
import DoAfterBuildTask from '@common/gulp-task/do-after-build-task';
import BrowserSyncReloadTask from '@common/gulp-task/browser-sync-reload-task';
import BrowserSyncTask from '@common/gulp-task/browser-sync-task';

const GulpTaskFormatted = (task) => {
  let gulpTaskFormatted = {
    tmp: null,
    end_tmp: null,
    dist: null,
  };

  if(
    typeof task.getTmp === 'function' &&
    !_isEmpty(task.getTmp())
  ) {
    gulpTaskFormatted.tmp = task.getTmp();
  }

  if(
    typeof task.getEndTmp === 'function' &&
    !_isEmpty(task.getEndTmp())
  ) {
    gulpTaskFormatted.end_tmp = task.getEndTmp();
  }

  if(
    typeof task.getDist === 'function' &&
    !_isEmpty(task.getDist())
  ) {
    gulpTaskFormatted.dist = task.getDist();
  }

  return gulpTaskFormatted;
}; // GulpTaskFormatted()

// NOTE - format CleanTask
export const CleanTaskFormatted = GulpTaskFormatted(new CleanTask());

// NOTE - format CopyImageTask
export const CopyImageTaskFormatted = GulpTaskFormatted(new CopyImageTask());

// NOTE - format CopyFontTask
export const CopyFontTaskFormatted = GulpTaskFormatted(new CopyFontTask());

// NOTE - format ConvertSassTask
export const ConvertSassTaskFormatted = GulpTaskFormatted(new ConvertSassTask());

// NOTE - format PrettierCssTask
export const PrettierCssTaskFormatted = GulpTaskFormatted(new PrettierCssTask());

// NOTE - format CompileJsTask
export const CompileJsTaskFormatted = GulpTaskFormatted(new CompileJsTask());

// NOTE - format ConvertNunjuckTask
export const ConvertNunjuckTaskFormatted = GulpTaskFormatted(new ConvertNunjuckTask());

// NOTE - format PrettierHtmlTask
export const PrettierHtmlTaskFormatted = GulpTaskFormatted(new PrettierHtmlTask());

// NOTE - format DummyDataTask
export const DummyDataTaskFormatted = GulpTaskFormatted(new DummyDataTask());

// NOTE - format DoAfterBuildTask
export const DoAfterBuildTaskFormatted = GulpTaskFormatted(new DoAfterBuildTask());

// NOTE - format BrowserSyncReloadTask
export const BrowserSyncReloadTaskFormatted = GulpTaskFormatted(new BrowserSyncReloadTask());

// NOTE - format BrowserSyncTask
export const BrowserSyncTaskFormatted = GulpTaskFormatted(new BrowserSyncTask());
