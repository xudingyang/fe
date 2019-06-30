<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" avatar>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 刚开始的时候没有supports这个数据 -->
        <div v-if="seller.supports" class="supprt">
          <span class="icon" :class="iconClassMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="title-img"></span>
      <span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VHeader',

    components: {},

    data () {
      return {}
    },

    props: {
      seller: {
        type: Object
      }
    },

    computed: {},

    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },

    methods: {
      showDetail () {}
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/mixin";
  $fz_w: 200;

  .header {
    color: #fff;
    background: rgba(7, 17, 27, 0.5);
    overflow: hidden;
    position: relative;
    .content-wrapper {
      padding: 24px 12px 18px 24px;
      font-size: 0px;
      position: relative;
      .avatar {
        display: inline-block;
        img {
          border-radius: 2px;
        }
      }
      .content {
        vertical-align: top;
        display: inline-block;
        margin-left: 12px;
        .title {
          margin: 2px 0 8px 0;
          .brand {
            display: inline-block;
            width: 30px;
            height: 18px;
            @include bg-image("../../components/header/brand");
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name {
            vertical-align: top;
            font-size: 16px;
            line-height: 18px;
            font-weight: bold;
            margin-left: 6px;
          }
        }
        .description {
          margin-bottom: 10px;
          font-size: 12px;
          line-height: 12px;
          font-weight: $fz_w;
        }
        .supprt {
          margin-bottom: 2px;
          font-weight: $fz_w;
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease {
              @include bg-image("../../components/header/decrease_1");
            }
            &.discount {
              @include bg-image("../../components/header/discount_1");
            }
            &.guarantee {
              @include bg-image("../../components/header/guarantee_1");
            }
            &.invoice {
              @include bg-image("../../components/header/invoice_1");
            }
            &.special {
              @include bg-image("../../components/header/special_1");
            }
          }
          .text {
            font-size: 10px;
            line-height: 12px;
          }
        }
      }
      .support-count {
        position: absolute;
        bottom: 18px;
        right: 12px;
        padding: 7px 10px;
        border-radius: 12px;
        background-color: rgba(0, 0, 0, .2);
        font-weight: $fz_w;
        color: #FFFFFF;
        .count {
          margin-right: 2px;
          font-size: 10px;
          line-height: 12px;
        }
        .icon-keyboard_arrow_right {
          line-height: 12px;
          font-size: 10px;
        }
      }
    }
    .bulletin-wrapper {
      position: relative;
      background-color: rgba(7, 17, 27, 0.2);
      padding: 0 22px 0 12px;
      height: 28px;
      font-weight: $fz_w;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .title-img {
        display: inline-block;
        @include bg-image("../../components/header/bulletin");
        width: 22px;
        height: 12px;
        background-size: 22px 12px;
        background-repeat: no-repeat;
        vertical-align: top;
        margin-top: 8px;
      }
      .text {
        font-size: 10px;
        line-height: 28px;
        margin: 0 4px;
      }
      .icon-keyboard_arrow_right {
        position: absolute;
        font-size: 10px;
        right: 10px;
        top: 8px;
      }
    }
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(10px);
      img {
        width: 100%;
        height: auto;
      }
    }
  }
</style>
