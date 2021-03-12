import APP from '@common/enum/source-enum';

//! ANCHOR    (generate path url method)
//-- generate path url
//? tạo path url dựa vào array path url truyền vào
export const generatePathUrl = function(filePath) {
  let strPathUrl = APP.lab.path + "\\" + filePath;

  return String(strPathUrl);
};

//! ANCHOR    (generate full path with specifical directory)
//? tạo path đầy đủ cho folder cụ thể
export const generateDirFromRootPath = function(strDirName) {
  return APP.lab.path + '\\' + strDirName.replace(/\//g,'\\');
};
