import Vue from '~jsPartialPath/global/vue-config';
import TheContentModal from '~jsPath/partial/global/component/the-content-modal/the-content-modal';
import TheHomeSection from './component/TheHomeSection.vue';

const HomePage = (() => {
  const _renderHomeSection = () => {
    const elHomeSection = document.getElementById('home-section');

    if(!elHomeSection) {
      return;
    }

    new Vue({
      render: (h) => h(TheHomeSection),
    }).$mount(elHomeSection);
  }; // _renderHomeSection()

  return {
    init() {
      TheContentModal.init();

      _renderHomeSection();
    }
  };
})();

HomePage.init();
