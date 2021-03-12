<template>
  <section
    v-if="!isEmpty(resProductList)"
    class="home-section"
  >
    <div class="container">
      <div class="home-block">
        <div class="home-block__product-wrap">
          <template v-for="(productItem, idx) in resProductList">
            <div
              :key="idx"
              class="home-block__product-wrap__item"
              @click="openModal(idx)"
            >
              <div class="home-block__product-wrap__item__head">
                <div class="home-block__product-wrap__item__logo">
                  <div class="home-block__product-wrap__item__logo-inner">
                    <img
                      :src="imageUrl + productItem.logo"
                      :alt="productItem.title"
                      class="home-block__product-wrap__item__logo-img"
                    >
                  </div>
                </div> <!-- .home-block__product-wrap__item__logo-col -->
              </div> <!-- .home-block__product-wrap__item__head -->

              <div class="home-block__product-wrap__item__body">
                <div class="home-block__product-wrap__item__title-group">
                  <div class="home-block__product-wrap__item__main-title">
                    {{ productItem.title }}
                  </div>

                  <div class="home-block__product-wrap__item__sub-title">
                    {{ productItem.short_desc }}
                  </div>
                </div> <!-- .home-block__product-wrap__item__title-col -->

                <div class="home-block__product-wrap__item__desc">
                  {{ productItem.desc }}
                </div> <!-- .home-block__product-wrap__item__desc -->
              </div> <!-- .home-block__product-wrap__item__body -->
            </div> <!-- .home-block__product-wrap__item -->
          </template>
        </div> <!-- .home-block__product-wrap -->
      </div> <!-- .home-block -->
    </div>
  </section> <!-- .home-section -->
</template>

<script>
import _ from 'lodash';
import { PAGE_INFO } from "~jsBasePath/define";
import TheContentModal from '~jsPartialPath/global/component/the-content-modal/the-content-modal';

export default {
  data() {
    const resProductList = this.$chaining(PAGE_INFO,'resProductList', 'data', 'product_list') || null;
    const imageUrl = (this.$chaining(PAGE_INFO,'image_url') || '') + '/logo/';

    return {
      resProductList,
      imageUrl,
    };
  },

  created() {
  },

  methods: {
    isEmpty: _.isEmpty,

    openModal(idx) {
      (TheContentModal.open())(this.resProductList[idx]);
    },
  },
}
</script>
