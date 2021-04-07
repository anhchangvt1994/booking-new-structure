import { uuidv4 } from '@common/define/module-define';

class GenerateRandom {
  version: number;
  private _randomNumber: Function;

  private _intRandomNumber: number = 1;

  constructor() {
    this._initSetupRandomNumber();
    this.version = this._randomNumber();
  }

  updateVersion() {
    this.version = this._randomNumber();
  }; // updateVersion()

  private _initSetupRandomNumber() {
    if(process.env.NODE_ENV === 'dev') {
      this._randomNumber = this._generateRandomNumber;
    } else if(process.env.NODE_ENV === 'production') {
      this._randomNumber = this._generateRandomWithUUID;
    }
  }; // _initSetupRandomNumber()

  private _generateRandomNumber() {
    this._intRandomNumber ^= this._intRandomNumber << 13;
    this._intRandomNumber ^= this._intRandomNumber >> 17;
    this._intRandomNumber ^= this._intRandomNumber << 5;

    return (this._intRandomNumber <0)?~this._intRandomNumber+1: this._intRandomNumber; //2's complement of the negative result to make all numbers positive.
  }; // _generateRandomNumber()

  private _generateRandomWithUUID() {
    return uuidv4(); //2's complement of the negative result to make all numbers positive.
  }; // _generateRandomWithUUID()
}

export default GenerateRandom;
