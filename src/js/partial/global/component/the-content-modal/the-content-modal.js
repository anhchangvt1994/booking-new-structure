import Vue from '~jsPartialPath/global/vue-config';
import TheContentModal from './TheContentModal.vue';

export default (() => {
  let _isInit = false;
  let _vTheContentModal = null;
  let _vTheContentModalHook = null;

  const _init = () => {
    if(!_isInit) {
      let elContentModal = document.getElementById('content__modal');

      if(!elContentModal) {
        elContentModal = document.createElement('div');

        elContentModal.id = 'content__modal';

        document.body.appendChild(elContentModal);
      }

      _render(elContentModal);

      _isInit = true;
    }
  }; // _init()

  const _render = (el) => {
    if(el) {
      _vTheContentModal = new Vue(
        {
          render: (h) => h(TheContentModal),
        }
      ).$mount(el);

      if(_vTheContentModal) {
        _vTheContentModalHook = _vTheContentModal?.$children?.[0] ?? [];

        _open();
      }
    }
  }; // _render()

  let _open = (() => {
    if(_vTheContentModalHook) {
      return _vTheContentModalHook.onOpenModal
    }
  }); // _open()

  return {
    init: _init,
    open: _open,
  };
})();
