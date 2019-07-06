<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
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
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import VHeader from '@/components/header/VHeader'

  const ERR_OK = 0

  export default {
    name: 'App',
    data () {
      return {
        seller: {}
      }
    },
    components: {
      VHeader
    },
    created () {
      this.axios.get('/api/seller').then((res) => {
        if (res.data.errno === ERR_OK) {
          this.seller = res.data.data
        }
      })
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
      box-sizing: border-box;
      @include border-1px(0, 0, 1px, 0);
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
