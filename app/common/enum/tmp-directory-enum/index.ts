import APP from '@common/enum/source-enum';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import { isEmpty as _isEmpty } from 'lodash';
import './tmp-directory-interface';

export const ARR_TMP_CONSTRUCT: TmpDirConstruct = {
  'css': {},
  'js': {},
  'html': {},
}

const _arrReadTmpDirConstructFile = require(APP.src.data + '/tmp-construct-log.json');

if(!_isEmpty(_arrReadTmpDirConstructFile)) {
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.CSS] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.CSS];
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.JS] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.JS];
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.HTML] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.HTML];
}

export const generateTmpDirItemConstruct = (arrTmpDirItemConstruct: TmpDirItemConstruct) => {
  return arrTmpDirItemConstruct;
};
