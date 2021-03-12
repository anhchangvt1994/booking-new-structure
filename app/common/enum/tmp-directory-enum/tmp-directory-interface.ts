interface TmpDirItemConstruct {
  'file-name': string,
  'file-path': string,
}

interface TmpDirConstruct {
  'css': {[key:string]: TmpDirItemConstruct},
  'js': {[key:string]: TmpDirItemConstruct},
  'html': {[key:string]: TmpDirItemConstruct},
}
