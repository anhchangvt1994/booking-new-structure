// Base by: PubSub pattern
// NOTE - https://docs.microsoft.com/en-us/previous-versions/msdn10/hh201955(v=msdn.10)

export default class PubSub {
  private _events: Object;

  constructor() {
    this._events = {};
  };

  subscibe(ev, callback) {
    const self = this;

    if(!self._events.hasOwnProperty(ev)) {
      self._events[ev] = [];
    }

    return self._events[ev].push(callback);
  }; // subsribe()

  publish(ev, data:Object = {}) {
    const self = this;

    if(!self._events.hasOwnProperty(ev)) {
      return [];
    }

    return self._events[ev].map(callback => callback(data));
  }; // publish()
};
