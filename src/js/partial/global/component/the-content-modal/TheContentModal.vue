<template>
  <div
    class="content-modal"
    :class="{ 'is-show' : isShow }"
  >
    <div
      class="content-modal__bg"
      @click="closeModal"
    ></div>

    <div class="content-modal__section">
      <div
        class="content-modal__section__head"
        :class="(content.title ? 'is-'+content.title.toLowerCase() : null)"
      >
        <div class="content-modal__section__head__logo-outer">
          <img
            class="content-modal__section__head__logo-img"
            :src="imageUrl + content.logo"
            alt=""
          >
        </div>

        <div
          class="content-modal__section__head__close-btn"
          @click="closeModal"
        ></div>
      </div> <!-- .content-modal__section__head -->

      <div class="content-modal__section__body">
        <div class="content-modal__section__body__content">
          {{ content.desc }}
        </div>

        <div class="content-modal__section__body__link">
          <a
            target="_blank"
            :href="content.url"
          >Xem thêm</a>
        </div>
      </div> <!-- .content-modal__section__body -->
    </div> <!-- .content-modal__section -->
  </div> <!-- .content-modal -->
</template>

<script>
import _ from 'lodash';
import { PAGE_INFO } from "~jsBasePath/define";

export default {
  data() {
    const CONTENT_DEFAULT = {
      title: '',
      logo: null,
      short_desc: null,
      desc: null,
      url: null,
    };

    const imageUrl = (this.$chaining(PAGE_INFO,'image_url') || '') + '/logo/';

    return {
      CONTENT_DEFAULT,
      content: CONTENT_DEFAULT,
      isShow: false,
      imageUrl,
    }
  },

  created() {},

  methods: {
    onOpenModal(content) {
      if(!_.isEmpty(content)) {
        const self = this;

        self.content = this.contentFormatted(content);

        self.isShow = true;
      }
    },

    contentFormatted(content) {
      if(_.isEmpty(content)) {
        return {};
      }

      const self = this;

      const _content = {};

      _.forIn(content, function(val, key) {
        if(typeof self.CONTENT_DEFAULT[key] !== undefined) {
          _content[key] = val;
        }
      });

      return _content;
    },

    closeModal() {
      this.isShow = false;
    }, // closeModal()
  },
}
</script>
