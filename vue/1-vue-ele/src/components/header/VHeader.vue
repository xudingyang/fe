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
    <transition name="fade">
      <div class="detail" v-show="detailShow" @touchmove.prevent>
        <div class="detail-wrapper">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <v-star :score="seller.score" :size="48"></v-star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                <span class="icon" :class="iconClassMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Star from '../star/star.vue'

  export default {
    name: 'VHeader',

    components: {
      'v-star': Star
    },

    props: {
      seller: {
        type: Object
      }
    },

    data () {
      return {
        iconClassMap: [],
        detailShow: false
      }
    },

    computed: {},

    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },

    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
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
        display: inline-block;
        vertical-align: top;
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
            line-height: 12px;
            font-size: 10px;
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
      color: #fff;
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
    .detail {
      position: fixed;
      z-index: 999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      background-color: rgba(7, 17, 27, 0.8);
      color: white;
      display: flex;
      flex-direction: column;
      .detail-wrapper {
        width: 100%;
        flex: 1;
        padding-bottom: 64px;
        padding-top: 64px;
        .detail-main {
          .name {
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
            color: #fff;
            text-align: center;
            margin-bottom: 16px;
          }
          .star-wrapper {
            text-align: center;
            padding: 2px 0;
          }
          .title {
            width: 80%;
            display: flex;
            margin: 28px auto 24px auto;
            .line {
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .text {
              font-size: 14px;
              font-weight: 700;
              padding: 0 12px;
            }
          }
          .supports {
            width: 80%;
            margin: 0 auto;
            .support-item {
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              color: #fff;
              .icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 6px;
                background-size: 16px 16px;
                background-repeat: no-repeat;
                vertical-align: top;
                &.decrease {
                  @include bg-image('../../components/header/decrease_1');
                }
                &.discount {
                  @include bg-image('../../components/header/discount_1');
                }
                &.guarantee {
                  @include bg-image('../../components/header/guarantee_1');
                }
                &.invoice {
                  @include bg-image('../../components/header/invoice_1');
                }
                &.special {
                  @include bg-image('../../components/header/special_1');
                }
              }
              .text {
                font-size: 12px;
                line-height: 16px;
                font-weight: $fz_w;
                color: #fff;
              }
            }
          }
          .bulletin {
            width: 80%;
            margin: 0 auto;
            .content {
              padding: 0 12px;
              line-height: 24px;
              font-size: 12px;
            }
          }
        }
      }
      .detail-close {
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        font-size: 12px;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
  }
</style>
