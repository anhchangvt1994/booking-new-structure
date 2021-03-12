import Store from '@common/store';
import '@common/watch-task/watch-task-interface';

//! ANCHOR - Define relative variable for Store

export const STATE_KEYS = {
  group_watch_file: 'group_watch_file',
};

export const MUTATION_KEYS = {
  set_group_watch_file: 'set_group_watch_file',
};

export const ACTION_KEYS = {
  generate_tmp_construct: 'generate_tmp_construct',
};

export const WatchTaskStore = new Store({
  state: {
    [STATE_KEYS.group_watch_file]: null,
  },

  mutations: {
    [MUTATION_KEYS.set_group_watch_file]: function(state, payload) {
      state[STATE_KEYS.group_watch_file] = payload;
    },
  },

  actions: {},
});
