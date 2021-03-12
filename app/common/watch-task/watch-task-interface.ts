interface arrRelativeTaskListInterface {
  'add'?: string,
  'remove'?: Function,
  'other'?: any,
};

interface arrWatchFilesConfigInterface {
  'source_path_url': string | Array<string>,
  'relative_task_list': arrRelativeTaskListInterface,
};
