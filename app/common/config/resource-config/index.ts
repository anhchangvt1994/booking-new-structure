import APP from '@common/enum/source-enum';

interface ResourceItemDataConstruct {
  'name'?: string,
  'arrCssFile': string[],
  'arrJsFile': string[],
  'dummy_data'?: boolean,
  'dummy_data_name'?: string,
};

interface ResourceItemConstruct {
  [key:string]: ResourceItemDataConstruct,
};

interface PathListItemDataConstruct {
  'src': string,
  'dummy_data': string,
  'njk': string,
  'global': string,
  'layout': string,
};

interface ResourceConstruct {
  'project': string,
  'port': any, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'ip_address': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'base_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'static_url': string, // NOTE - Lưu ý những thông tin này cần được config trong file host trước
  'local': string,
  'path': PathListItemDataConstruct,
  'resource': ResourceItemConstruct,
  'dummy_data_name_map': {
    [key:string]: string,
  }
};

export let BASE_URL:string;
export let BASE_STATIC_URL:string;

export const RESOURCE: ResourceConstruct = {
  'project': 'gulp',
  'port': process.env.PORT || 3000,
  'ip_address': null,
  'base_url': 'dev.vn',
  'static_url': 'static.dev.vn',
  'local': 'localhost',

  'path': {
    'src': APP.src.path,
    'dummy_data': APP.src.dummy_data,
    'njk': APP.src.njk,
    'global': APP.src.njk + '/global',
    'layout': APP.src.njk + '/_layout.njk',
  },

  'resource': {
    "libs" : {
      "arrCssFile": [],
      "arrJsFile": []
    },

    "common" : {
      "arrCssFile": [
        'vendor-style'
      ],
      "arrJsFile": [
        'vendor',
      ]
    },

    "index" : {
      'name': 'index',
      "arrCssFile" : [],
      "arrJsFile" : [
        "app"
      ],
      'dummy_data': true,
      'dummy_data_name': 'app'
    },
  },

  'dummy_data_name_map': {
    'app': 'index'
  },
};

//=======================================
// NOTE - generate External IP
//=======================================
const os = require('os');
const OSNetworkInterfaces = os.networkInterfaces();
const Ethernet = OSNetworkInterfaces.Ethernet || Object.values(OSNetworkInterfaces);

if(Ethernet) {
  Ethernet.some(function(ethernetItem) {
    const ethernetItemInfo = ethernetItem.family ? ethernetItem : ethernetItem[1] || ethernetItem[0];

    if(
      ethernetItemInfo.family.toLowerCase() === 'ipv4' &&
      ethernetItemInfo.address !== '127.0.0.1'
    ) {
      RESOURCE.ip_address = ethernetItemInfo.address;
      return true;
    }
  });
}

if(process.env.NODE_ENV === 'dev') {
  BASE_URL = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
  BASE_STATIC_URL = 'http://' + RESOURCE.ip_address + ':' + RESOURCE.port;
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://' + RESOURCE.base_url;
  BASE_STATIC_URL = 'http://' + RESOURCE.static_url;
}
