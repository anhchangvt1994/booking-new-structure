import _ = require('lodash');
import Store from '@common/store';
import '@common/enum/tmp-directory-enum/tmp-directory-interface';

//! ANCHOR - Define relative variable for Store

export const STATE_KEYS = {
  is_njk_finish: 'is_njk_finish',
  is_sass_finish: 'is_sass_finish',
  is_js_finish: 'is_js_finish',
  is_browser_sync_finish: 'is_browser_sync_finish',

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
  set_is_njk_finish: 'set_is_njk_finish',
  set_is_sass_finish: 'set_is_sass_finish',
  set_is_js_finish: 'set_is_js_finish',
  set_is_browser_sync_finish: 'set_is_browser_sync_finish',

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
    [STATE_KEYS.is_njk_finish]: false,
    [STATE_KEYS.is_sass_finish]: false,
    [STATE_KEYS.is_js_finish]: false,
    [STATE_KEYS.is_browser_sync_finish]: false,

    [STATE_KEYS.handler_error_util]: null,
    [STATE_KEYS.update_version]: null,
    [STATE_KEYS.is_first_compile_all]: true,
    [STATE_KEYS.tmp_construct]: {},
    [STATE_KEYS.move_file]: null,
    [STATE_KEYS.js_dependents]: null,
    [STATE_KEYS.njk_dependents]: null,
    [STATE_KEYS.dummy_data_manager]: null,
  },

  mutations: {
    [MUTATION_KEYS.set_is_njk_finish]: function(state, payload) {
      state[STATE_KEYS.is_njk_finish] = payload;
    },

    [MUTATION_KEYS.set_is_sass_finish]: function(state, payload) {
      state[STATE_KEYS.is_sass_finish] = payload;
    },

    [MUTATION_KEYS.set_is_js_finish]: function(state, payload) {
      state[STATE_KEYS.is_js_finish] = payload;
    },

    [MUTATION_KEYS.set_is_browser_sync_finish]: function(state, payload) {
      state[STATE_KEYS.is_browser_sync_finish] = payload;
    },

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
        !payload.ext_tmp_construct ||
        (
          !payload.ext_tmp_construct.file_name ||
          !payload.ext_tmp_construct.file_path
        )
      ) {
        return;
      }

      const tmpConstructClone = _.cloneDeep(context.get(STATE_KEYS.tmp_construct));
      const extension = payload.ext;
      const extTmpConstruct = payload.ext_tmp_construct;

      tmpConstructClone[extension][extTmpConstruct.file_name] = extTmpConstruct;

      context.commit(MUTATION_KEYS.set_tmp_construct, tmpConstructClone);
    },
  },
});
