<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import VHeader from '@/components/header/VHeader'

  export default {
    name: 'App',
    data () {
      return {
        seller: {}
      }
    },
    components: {
      VHeader
    }

  }
</script>

<style lang="scss">
  @import "common/scss/variables";
  @import "common/scss/mixin";

  #app {
    .tab {
      display: flex;
      height: 40px;
      line-height: 40px;
      @include border-bottom-1px($border-color-3);

      .tab-item {
        flex: 1;
        text-align: center;

        > a {
          display: block;
          font-size: 14px;
          color: rgb(77, 85, 93);

          &.router-link-active {
            color: rgb(240, 20, 20);
          }
        }
      }
    }
  }
</style>
