import { isEmpty as _isEmpty, forIn as _forIn } from 'lodash';
import { ARR_FILE_EXTENSION, ARR_FILE_EXTENSION_FULL_NAME } from '@common/define/file-define';
import {
  highlight as _highlight,
  textColorRed as _textColorRed,
  textColorYellow as _textColorYellow,
  textColorGreen as _textColorGreen
} from '@common/define/highlight-define';

interface ArrErrorConstruct {
  [key:string] : string | {[key:string] : string} | any,
};

class HandlerErrorUtil {
  arrError: ArrErrorConstruct = {
    [ARR_FILE_EXTENSION.CSS] : '',
    [ARR_FILE_EXTENSION.NJK] : {},
    [ARR_FILE_EXTENSION.JS] : {},
    [ARR_FILE_EXTENSION.JSON] : {},
  };

  constructor() {}

  //! ANCHOR - handlerError
  // NOTE - Dựng khung xử lý nạp error theo các cases cụ thể
  handlerError(
    err: any,
    extFileName: string,
    isFirstCompileAll?: boolean,
    isMultiCheck?: boolean,
  ) {
    const self = this;

    // NOTE - Nếu là lần đầu build thì nạp error vào arrError
    if(isFirstCompileAll) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - ngược lại nếu arrError không rỗng thì nạp error vào arrError
    else if(!_isEmpty(self.arrError)) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - Ngược lại nếu nhận được cờ isMultiCheck (trường hợp rebuid lại khi remove/copy paste files) thì nạp error vào arrError
    else if(isMultiCheck) {
      self._addErrorList(
        err,
        extFileName
      );
    }

    // NOTE - Ngược lại nếu không nằm ở những trường hợp trên thì in error ra luôn, không cần nạp
    else {
      if(!_isEmpty(err)) {
        let strFilePath = null;

        if(err.file) {
          strFilePath = err.file;
        } else if(err.fileName) {
          strFilePath = err.fileName;
        }

        strFilePath = strFilePath.replace(/\\/g,'/');

        setTimeout(function() {
          self.reportError(self._generateCustomError(err, strFilePath, extFileName));
        }, 100);
      }
    }
  }; // handlerError()

  //! ANCHOR - checkClearError
  // NOTE - Dùng check file hiện tại còn error hay không? Nếu không còn thì set về null
  checkClearError(
    isError: boolean,
    extFileName: string,
    strErrKey?: string
  ) {
    const self = this;

    // NOTE - Nếu arrError rỗng hoặc cờ isError đã được bật thì không cần thực thi checkClearError
    if(
      _isEmpty(self.arrError) ||
      isError
    ) {
      return;
    }

    if(strErrKey) {
      delete self.arrError[extFileName][strErrKey];
    } else {
      self.arrError[extFileName] = null;
    }
  } // checkClearError()

  //! ANCHOR - reportError
  // NOTE - Check điều kiện hiển thị error, có thể là arrError hoặc chỉ 1 dòng error
  reportError(customError?: string) {
    const self = this;

    if(customError) {
      console.log(customError);
      return;
    } else if(!_isEmpty(self.arrError)) {
      const _strCssError = self.arrError[ARR_FILE_EXTENSION.CSS];
      const _arrNjkErrorItemList = self.arrError[ARR_FILE_EXTENSION.NJK];
      const _arrJsErrorItemList = self.arrError[ARR_FILE_EXTENSION.JS];
      const _arrJsonErrorItemList = self.arrError[ARR_FILE_EXTENSION.JSON];

      if(!_isEmpty(_strCssError)) {
        console.log(_strCssError);
      }

      if(!_isEmpty(_arrNjkErrorItemList)) {
        for (const strErrKey in _arrNjkErrorItemList) {
          if(_arrNjkErrorItemList[strErrKey]) {
            console.log(_arrNjkErrorItemList[strErrKey]);
            break;
          }
        }
      }

      if(!_isEmpty(_arrJsErrorItemList)) {
        for(const strErrKey in _arrJsErrorItemList) {
          if(_arrJsErrorItemList[strErrKey]) {
            console.log(_arrJsErrorItemList[strErrKey]);
            break;
          }
        }
      }

      if(!_isEmpty(_arrJsonErrorItemList)) {
        for(const strErrKey in _arrJsonErrorItemList) {
          if(_arrJsonErrorItemList[strErrKey]) {
            console.log(_arrJsonErrorItemList[strErrKey]);
            break;
          }
        }
      }
    }
  } // reportError()

  //! ANCHOR - notiSuccess
  // NOTE - Kiểm tra và hiển thị thông báo success fix issue / error đối với các file
  notifSuccess() {
    const self = this;
    let _isHasSuccess = false;

    if(_isEmpty(self.arrError[ARR_FILE_EXTENSION.CSS])) {
      let notify = '';
      notify = ARR_FILE_EXTENSION_FULL_NAME[ARR_FILE_EXTENSION.CSS] + '  : ';
      notify += _textColorGreen('procress is success!');

      console.log(notify);

      _isHasSuccess = true;
    }

    if(_isEmpty(self.arrError[ARR_FILE_EXTENSION.NJK])) {
      let notify = '';
      notify = ARR_FILE_EXTENSION_FULL_NAME[ARR_FILE_EXTENSION.NJK] + ' : ';
      notify += _textColorGreen('procress is success!');

      console.log(notify);

      _isHasSuccess = true;
    }

    if(_isEmpty(self.arrError[ARR_FILE_EXTENSION.JS])) {
      let notify = '';
      notify = ARR_FILE_EXTENSION_FULL_NAME[ARR_FILE_EXTENSION.JS] + ' : ';
      notify += _textColorGreen('procress is success!');

      console.log(notify);

      _isHasSuccess = true;
    }

    if(_isHasSuccess) {
      console.log('\n');
    }
  } // notifSuccess

  //! ANCHOR - _addErrorList
  private _addErrorList(
    err: any,
    extFileName: string
  ) {
    const self = this;

    if(!_isEmpty(err)) {
      let strErrKey = null; // NOTE - strErrKey có thể là extension của file đó hoặc file name
      let strFilePath = null;

      if(err.file) {
        strFilePath = err.file;
      } else if(err.fileName) {
        strFilePath = err.fileName;
      }

      strFilePath = strFilePath.replace(/\\/g,'/');

      if(extFileName === ARR_FILE_EXTENSION.CSS) {
        self.arrError[extFileName] = self._generateCustomError(err, strFilePath, extFileName);
      } else {
        strErrKey = strFilePath.split('/').slice(-2)[1];

        if(
          strErrKey === 'index.js' ||
          strErrKey === 'index.njk'
        ) {
          strErrKey = strFilePath.split('/').slice(-2)[0] + '.' + extFileName;
        }

        self.arrError[extFileName][strErrKey] = self._generateCustomError(err, strFilePath, extFileName);
      }
    }
  } // _addErrorList()

  //! ANCHOR - _generateCustomError
  private _generateCustomError(
    err: any,
    strFilePath: string,
    extFileName: string
  ) : string {
    let intLineNumber = null;

    let report = '\n\n---------------- ' + ARR_FILE_EXTENSION_FULL_NAME[extFileName] + ' ----------------\n\n';

    report += _highlight('TASK:') + _textColorRed(' [' + err.plugin + ']') + '\n';
    report += _highlight('PROB:') + ' ' + _textColorRed(err.message) + '\n';
    if(err.line) {
      report += _highlight('LINE:') + ' ' + _textColorYellow(err.line) + '\n';
      intLineNumber = err.line;
    } else if(err.lineNumber) {
      report += _highlight('LINE:') + ' ' + _textColorYellow(err.lineNumber) + '\n';
      intLineNumber = err.lineNumber;
    }

    report += _highlight('FILE:') + ' ' + _textColorRed(strFilePath);

    if(intLineNumber) {
      report += _textColorYellow(':' + intLineNumber) + '\n';
    }

    return report;
  }
}

export default HandlerErrorUtil;
