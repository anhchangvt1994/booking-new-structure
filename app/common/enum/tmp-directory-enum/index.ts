import { fs } from '@common/define/module-define';
import APP from '@common/enum/source-enum';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import { isEmpty as _isEmpty } from 'lodash';
import './tmp-directory-interface';

export const ARR_TMP_CONSTRUCT: TmpDirConstruct = {
  'css': {},
  'js': {},
  'html': {},
}

const _tmpConstructLogPath = APP.src.data + '/tmp-construct-log.json';
let _arrReadTmpDirConstructFile = null;

if(fs.existsSync(_tmpConstructLogPath)) {
  try {
    _arrReadTmpDirConstructFile = fs.readFileSync(_tmpConstructLogPath, 'utf-8');
    _arrReadTmpDirConstructFile = JSON.parse(_arrReadTmpDirConstructFile || '{}');
  } catch(err) {
    console.log(err);
  }
} else {
  try {
    fs.writeFileSync(APP.src.data + '/tmp-construct-log.json', '{}');
    _arrReadTmpDirConstructFile = {};
  } catch(err) {
    console.log(err);
  }
}

if(!_isEmpty(_arrReadTmpDirConstructFile)) {
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.CSS] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.CSS];
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.JS] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.JS];
  ARR_TMP_CONSTRUCT[ARR_FILE_EXTENSION.HTML] = _arrReadTmpDirConstructFile[ARR_FILE_EXTENSION.HTML];
}

export const generateTmpDirItemConstruct = (arrTmpDirItemConstruct: TmpDirItemConstruct) => {
  if(!arrTmpDirItemConstruct.extension) {
    arrTmpDirItemConstruct.extension = ARR_FILE_EXTENSION.CSS;
  }

  return {
    ext: arrTmpDirItemConstruct.extension,
    ext_tmp_construct: {
      file_name: arrTmpDirItemConstruct.file_name,
      file_path: arrTmpDirItemConstruct.file_path,
    }
  };
};
