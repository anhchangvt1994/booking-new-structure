const _strAppDirUrl:string = __dirname.split('app')[0] + 'app';
interface arrDirNameConstruct {
  'common': string,
  'define': string,
  'enum': string,
  'util': string,
  'source-enum': string,
  'gulp-task-util': string,
};

// định nghĩa type cho _ARR_DIR_PARENT, _ARR_DIR_CHILD
//! sau tìm hiểu tách riêng ra file declaration ts
interface ArrDirConstruct {
  'parent_dir'?: string,
  'common'?: string[],
  'define'?: string[],
  'enum'?: string[],
  'util'?: string[],
};

const _ARR_DIR_PARENT:ArrDirConstruct = {
  'common': [
    'enum',
    'util',
    'define'
  ]
};

const _ARR_DIR_CHILD:ArrDirConstruct = {
  'parent_dir': '/common',
  'define': [],
  'enum': [
    'source-enum',
  ],
  'util': [
    'gulp-task-util',
  ],
};


interface ArrUrlWithBaseDirItemConstruct {
  'base'?: string,
  'define'?: string,
  'enum'?: string,
  'util'?: string,
  'source-enum'?: string,
  'gulp-task-util'?: string,
};

interface ArrUrlWithDefineDirItemConstruct {

};

interface ArrUrlWithEnumDirItemConstruct {
  [_ARR_DIR_PARENT['common']]
};

interface ArrUrlWithUtilDirItemConstruct {

};

interface ArrUrlWithBaseDirConstruct {
  'base'?: string,
  'common'?: 
  'define'?: ArrUrlWithBaseDirItemConstruct,
  'enum'?: ArrUrlWithBaseDirItemConstruct,
  'util'?: ArrUrlWithBaseDirItemConstruct,
};

const getUrlWithBaseDir = function(baseDir:string, isGetDeep?:boolean):ArrUrlWithBaseDirConstruct {
  const arrUrlWithBaseDir:ArrUrlWithBaseDirConstruct = {};

  if(typeof _ARR_DIR_CHILD[baseDir] === 'object') {
    arrUrlWithBaseDir.base = _strAppDirUrl + _ARR_DIR_CHILD['parent_dir'] +  '/' + baseDir;

    if(_ARR_DIR_CHILD[baseDir].length > 0) {
      _ARR_DIR_CHILD[baseDir].forEach(function(strDirItem) {
        arrUrlWithBaseDir[strDirItem] = arrUrlWithBaseDir.base + '/' + strDirItem;
      });
    }
  } else if(typeof _ARR_DIR_PARENT[baseDir] === 'object') {
    let arrDirChildKey = [];
    arrUrlWithBaseDir.base = _strAppDirUrl + '/' + baseDir;

    if(_ARR_DIR_PARENT[baseDir].length > 0) {
      _ARR_DIR_PARENT[baseDir].forEach(function(strDirItem) {
        if(
          isGetDeep &&
          typeof _ARR_DIR_CHILD[strDirItem] === 'object' &&
          _ARR_DIR_CHILD[strDirItem].length > 0
        ) {
          arrUrlWithBaseDir[strDirItem] = {};
          arrUrlWithBaseDir[strDirItem].base = arrUrlWithBaseDir.base + '/' + strDirItem;
          arrDirChildKey.push(strDirItem);
        } else {
          arrUrlWithBaseDir[strDirItem] = arrUrlWithBaseDir.base + '/' + strDirItem;
        }
      });
    }

    if(arrDirChildKey.length > 0) {
      arrDirChildKey.forEach(function(strDirItem) {
        _ARR_DIR_CHILD[strDirItem].forEach(function(strChildDirItem) {
          arrUrlWithBaseDir[strDirItem][strChildDirItem] = arrUrlWithBaseDir[strDirItem].base + '/' + strChildDirItem;
        });
      });
    }
  }

  return arrUrlWithBaseDir;
};

export default getUrlWithBaseDir;