import Store from '@common/store';
import { ARR_FILE_EXTENSION } from '@common/define/file-define';
import '@common/enum/tmp-directory-enum/tmp-directory-interface';

//! ANCHOR - Define relative variable for Store

export const STATE_KEYS = {
  handler_error_util: 'handler_error_util',
  update_version: 'update_version',
  is_first_compile_all: 'is_first_compile_all',
  tmp_construct: 'tmp_construct',
  move_file: 'move_file',
  js_dependents: 'js_dependents',
  njk_dependents: 'njk_dependents',
  dummy_data_manager: 'dummy_data_manager',
};

export const MUTATION_KEYS = {
  set_handler_error_util: 'set_handler_error_util',
  set_update_version: 'set_update_version',
  set_is_first_compile_all: 'set_is_first_compile_all',
  set_tmp_construct: 'set_tmp_construct',
  set_move_file: 'set_move_file',
  set_js_dependents: 'set_js_dependents',
  set_njk_dependents: 'set_njk_dependents',
  set_dummy_data_manager: 'set_dummy_data_manager',
};

export const ACTION_KEYS = {
  generate_tmp_construct: 'generate_tmp_construct',
};

export const GulpTaskStore = new Store({
  state: {
    [STATE_KEYS.handler_error_util]: null,
    [STATE_KEYS.update_version]: null,
    [STATE_KEYS.is_first_compile_all]: true,
    [STATE_KEYS.tmp_construct]: {},
  },

  mutations: {
    [MUTATION_KEYS.set_handler_error_util]: function(state, payload) {
      state[STATE_KEYS.handler_error_util] = payload;
    },

    [MUTATION_KEYS.set_update_version]: function(state, payload) {
      state[STATE_KEYS.update_version] = payload;
    },

    [MUTATION_KEYS.set_is_first_compile_all]: function(state, payload) {
      state[STATE_KEYS.is_first_compile_all] = payload;
    },

    [MUTATION_KEYS.set_tmp_construct]: function(state, payload) {
      state[STATE_KEYS.tmp_construct] = payload;
    },

    [MUTATION_KEYS.set_move_file]: function(state, payload) {
      state[STATE_KEYS.move_file] = payload;
    },

    [MUTATION_KEYS.set_js_dependents]: function(state, payload) {
      state[STATE_KEYS.js_dependents] = payload;
    },

    [MUTATION_KEYS.set_njk_dependents]: function(state, payload) {
      state[STATE_KEYS.njk_dependents] = payload;
    },

    [MUTATION_KEYS.set_dummy_data_manager]: function(state, payload) {
      state[STATE_KEYS.dummy_data_manager] = payload;
    },
  },

  actions: {
    [ACTION_KEYS.generate_tmp_construct]: function(context, payload) {
      if(
        !payload ||
        (
          !payload.hasOwnProperty('file-name') ||
          !payload.hasOwnProperty('file-path')
        )
      ) {
        return;
      }

      const curTmpConstruct = context.get(STATE_KEYS.tmp_construct);

      curTmpConstruct[ARR_FILE_EXTENSION.CSS][payload['file-name']] = payload;

      const newTmpConstruct = curTmpConstruct;

      context.commit(MUTATION_KEYS.set_tmp_construct, newTmpConstruct);
    },
  },
});
