import {
  MUTATION_KEYS,
  GulpTaskStore,
} from './store';
import APP from '@common/enum/source-enum';
import modules from '@common/define/module-define';
import GenerateRandom from '@common/enum/random-enum';
import Dependents from '@common/util/dependent-util';
import { ARR_TMP_CONSTRUCT } from '@common/enum/tmp-directory-enum';
import HandlerErrorUtil from '@common/util/hanlder-report-util';
import DataManager from '@src/dummy-data/data-manager';

// NOTE - Setup value for 'handler_error_util'
const _handlerErrorUtil = new HandlerErrorUtil();
GulpTaskStore.commit(MUTATION_KEYS.set_handler_error_util, _handlerErrorUtil);

// NOTE - Setup value for 'set_update_version'
const generateRandomNumber = new GenerateRandom();

GulpTaskStore.commit(MUTATION_KEYS.set_update_version, generateRandomNumber.version);

// NOTE - Update new cache version mỗi 5 phút

if(process.env.NODE_ENV === 'dev') {
  setInterval(function() {
    generateRandomNumber.updateVersion();

    GulpTaskStore.commit(MUTATION_KEYS.set_update_version, generateRandomNumber.version);

    console.log(modules.ansiColors.blueBright(`update new Sass cache version: ${generateRandomNumber.version}`));
    console.log(modules.ansiColors.blueBright(`update new Nunjucks cache version: ${generateRandomNumber.version}`));
  }, 300000);
}

// NOTE - Setup value for 'tmp_construct'
GulpTaskStore.commit(MUTATION_KEYS.set_tmp_construct, ARR_TMP_CONSTRUCT);

// NOTE - Setup value for 'move_file'
//? sử dụng để move file từ source sang dir khác
interface ArrMoveFilesConfigConstruct {
  'sourcePathUrl': string,
  'cacheFileExt'?: string,
  'targetPathUrl': string,
  'compressModule'?: any,
};

GulpTaskStore.commit(MUTATION_KEYS.set_move_file, function(arrMoveFilesConfig: ArrMoveFilesConfigConstruct) {
  if(arrMoveFilesConfig.targetPathUrl.indexOf(APP.tmp.path) === -1) {
    if(arrMoveFilesConfig.compressModule) {
      return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
        .pipe(modules.plumber())
        .pipe(arrMoveFilesConfig.compressModule)
        .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
    }

    return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
      .pipe(modules.plumber())
      .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
  } else {
    arrMoveFilesConfig.cacheFileExt = arrMoveFilesConfig.cacheFileExt || '';

    return modules.gulp.src(arrMoveFilesConfig.sourcePathUrl)
      .pipe(modules.plumber())
      .pipe(modules.cached(arrMoveFilesConfig.cacheFileExt))
      .pipe(modules.dependents())
      .pipe(modules.print(
        filepath => `copy: ${filepath}`
      ))
      .pipe(modules.gulp.dest(arrMoveFilesConfig.targetPathUrl));
  }
});

// NOTE - Setup value for 'js_dependents'
const JsDependents = new Dependents('js');
GulpTaskStore.commit(MUTATION_KEYS.set_js_dependents, JsDependents);

// NOTE - Setup value for 'njk_dependents'
const NjkDependents = new Dependents('njk');
GulpTaskStore.commit(MUTATION_KEYS.set_njk_dependents, NjkDependents);

// NOTE - Setup value for 'dummy_data_manager'
const _dummyDataManager = new DataManager();
GulpTaskStore.commit(MUTATION_KEYS.set_dummy_data_manager, _dummyDataManager);
