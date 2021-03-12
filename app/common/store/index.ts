import {
  highlight as _highlight,
  textColorRed as _textColorRed,
  textColorYellow as _textColorYellow,
  textColorGreen as _textColorGreen
} from '@common/define/highlight-define';

interface StorePropertyInterface {
  mutations: string,
  actions: string,
  state: string,
  default_status: string,
}; // StorePropertyInterface

interface StoreParamsInterface {
  mutations?: Object,
  actions?: Object,
  state: Object,
}; // StoreParamsInterface

export default class Store {
  private _state: any = {};
  private _mutations: Object;
  private _actions: Object;
  private _status: string;

  private _STORE_PROTOTYPE:StorePropertyInterface = {
    mutations: 'mutations',
    actions: 'actions',
    state: 'state',
    default_status: 'resting',
  };

  constructor(params: StoreParamsInterface) {
    const self = this;

    self._actions = {};
    self._mutations = {};

    self._status = self._STORE_PROTOTYPE.default_status;

    if(params.hasOwnProperty(self._STORE_PROTOTYPE.mutations)) {
      self._mutations = params.mutations;
    }

    if(params.hasOwnProperty(self._STORE_PROTOTYPE.actions)) {
      self._actions = params.actions;
    }

    self._state = new Proxy((params.state || {}), {
      set: function(state: Object, key: string, value: any) {
        state[key] = value;

        _textColorRed(`stateChange: ${ key }: ${ value }`);

        if(self._status !== self._STORE_PROTOTYPE.mutations) {
          _textColorYellow(`You should use a mutation to set ${key}`);
        }

        self._status = self._STORE_PROTOTYPE.default_status;

        return true;
      },
    });
  };

  commit(mutationKey, payload) {
    const self = this;

    if(typeof self._mutations[mutationKey] !== 'function') {
      _textColorRed(`Mutation "${ mutationKey }" doesn't exist`);

      return false;
    }

    self._status = self._STORE_PROTOTYPE.mutations;

    self._mutations[mutationKey](self._state, payload);
  }; // commit()

  dispatch(actionKey, payload) {
    const self = this;

    if(typeof self._actions[actionKey] !== 'function') {
      _textColorRed(`Action "${actionKey} doesn't exist.`);
      return false;
    }

    self._status = self._STORE_PROTOTYPE.actions;

    self._actions[actionKey](self, payload);

    return true;
  }; // dispatch()

  get(stateKey) {
    const self = this;

    if(!self._state.hasOwnProperty(stateKey)) {
      return null;
    }

    return self._state[stateKey];
  }; // get
};
