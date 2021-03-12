const _DIR_PATH = __dirname.replace(/\\/g, '/');
const _LAB_PATH = _DIR_PATH.split('/app')[0];

const _APP_LAB_PATH: string = _LAB_PATH + '/'; // url của lab directory

const _APP_SRC_PATH: string = _LAB_PATH + '/src/'; // url của source directory (nơi để dev)

const _APP_TMP_PATH: string = _LAB_PATH + '/tmp/'; // url của temp directory (nơi để built source deploy)

const _APP_DIST_PATH: string = _LAB_PATH + '/dist/'; // url của dist directory (nơi chứa source production live)

interface AppItemConstruct {
  path: string,
  scss?: string,
  css?: string,
  js: string,
  image: string,
  font: string,
  njk?: string,
  data?: string,
  dummy_data?: string,
  urlConfig?: string,
};

interface AppConstruct {
  lab: {path: string},
  src: AppItemConstruct,
  tmp: AppItemConstruct,
  dist: AppItemConstruct,
};

const APP: AppConstruct = {
  lab: {
    path: _APP_LAB_PATH,
  },
  src: {
    path : _APP_SRC_PATH,
    scss : _APP_SRC_PATH + 'scss',
    js : _APP_SRC_PATH + 'js',
    image : _APP_LAB_PATH + 'image',
    font : _APP_LAB_PATH + 'font',
    njk : _APP_SRC_PATH + 'njk',
    data : _APP_SRC_PATH + 'data',
    dummy_data: _APP_SRC_PATH + 'dummy-data',
    urlConfig : _APP_SRC_PATH + 'urlConfig',
  },

  tmp: {
    path : _APP_TMP_PATH,
    css : _APP_TMP_PATH + 'css',
    js : _APP_TMP_PATH + 'js',
    image : _APP_LAB_PATH + 'image',
    font : _APP_LAB_PATH + 'font',
  },

  dist: {
    path : _APP_DIST_PATH,
    css : _APP_DIST_PATH + 'css',
    js : _APP_DIST_PATH + 'js',
    image : _APP_DIST_PATH + 'image',
    font : _APP_DIST_PATH + 'font',
  }
};

export default APP;
