class GenerateRandom {
  version: number;

  private _intRandomNumber: number = 1;

  constructor() {
    this.version = this._generateRandomNumber();
  }

  updateVersion() {
    this.version = this._generateRandomNumber();
  }

  private _generateRandomNumber() {
    this._intRandomNumber ^= this._intRandomNumber << 13;
    this._intRandomNumber ^= this._intRandomNumber >> 17;
    this._intRandomNumber ^= this._intRandomNumber << 5;

    return (this._intRandomNumber <0)?~this._intRandomNumber+1: this._intRandomNumber; //2's complement of the negative result to make all numbers positive.
  }
}

export default GenerateRandom;
