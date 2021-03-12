const _strAppDirUrl = __dirname.split('app')[0] + 'app';

const _ARR_DIR_PARENT = {
  'common': [
    'enum',
    'util',
    'define'
  ]
};

const _ARR_DIR_CHILD = {
  'parent_dir': '/common',
  'define': [],
  'enum': [
    'source-enum',
  ],
  'util': [
    'gulp-task-util',
  ],
};

const getUrlWithBaseDir = function(baseDir, isGetDeep) {
  const arrUrlWithBaseDir = {};

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

module.exports = {
  getUrlWithBaseDir,
};