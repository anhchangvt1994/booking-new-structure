import DataManage from '@src/data/data-manage';

import { ArrHeaderDataConstruct } from '@src/data/data-manage/header-data';

interface ArrDataItemConstruct<T> {
  'title': string,
  'keywords': string,
  'description': string,
  'bodyClass': string,
  'data': T,
};

interface ArrDataConstruct {
  'header-data': ArrDataItemConstruct<ArrHeaderDataConstruct>,
};

const DATA: ArrDataConstruct = {
  'header-data': {
    'title': 'asfasdf',
    'keywords': 'asfasdf',
    'description': 'asfasdf',
    'bodyClass': 'asfasdf',
    'data': DataManage.HeaderData
  }
}


export default DATA;
