interface TmpDirItemConstruct {
  'extension'?: string,
  'file_name': string,
  'file_path': string,
}

interface TmpDirConstruct {
  'css': {[key:string]: TmpDirItemConstruct},
  'js': {[key:string]: TmpDirItemConstruct},
  'html': {[key:string]: TmpDirItemConstruct},
}
