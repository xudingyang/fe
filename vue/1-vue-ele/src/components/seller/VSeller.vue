<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <div class="desc">
          <h1 class="name">{{seller.name}}</h1>
          <div class="rating">
            <star class="star" :size="36" :score="seller.score"></star>
            <span class="rating-count">({{seller.ratingCount}})</span>
            <span class="sell-count">月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <div class="delivery">
          <div class="delivery-item">
            <h1>起送价</h1>
            <span>{{seller.minPrice}}</span><i>元</i>
          </div>
          <div class="delivery-item">
            <h1>商家配送</h1>
            <span>{{seller.deliveryPrice}}</span><i>元</i>
          </div>
          <div class="delivery-item">
            <h1>平均配送时间</h1>
            <span>{{seller.deliveryTime}}</span><i>分钟</i>
          </div>
        </div>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="content">{{seller.bulletin}}</p>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
            <span class="icon" :class="iconClassMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(item, index) in seller.pics" :key="index">
              <img :src="item" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../star/star.vue'
  import BScroll from 'better-scroll'
  import { saveToLocal, loadFromLocal } from '../../common/js/store'

  export default {
    name: 'seller',
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        // 其实iconClassMap不用在data里声明，created里已经有了this.iconClassMap
//        iconClassMap: [],
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    mounted () {
      // 既然在watch观察了seller，那么为什么在这里还要搞一次呢？
      // 因为从本组件切到别的组件、再切回本组件的时候，seller是不会变化的，所以watch里的东东就不起作用了
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    },
    watch: {
      // 要确保seller有数据了才增加BScroll事件
      // seller是其他组件传过来的，当本组件created的时候不能保证有seller，所以在created的$nextTick方法里也不能设置BScroll
      // 其他组件在created里通过网络请求获得数据，所以可以再created的$nextTick里面增加BScroll。但是本组件不是这样。
      'seller' () {
        this.$nextTick(() => {
          this._initScroll()
          this._initPics()
        })
      }
    },
    methods: {
      toggleFavorite (event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      },
      _initScroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      _initPics () {
        if (this.seller.pics) {
          let picWidth = 120
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length - margin
          this.$refs.picList.style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      }
    },
    components: {
      star
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/mixin";

  .seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background-color: #f3f5f7;
  }

  .overview {
    position: relative;
    padding: 18px;
    margin-bottom: 18px;
    background-color: #fff;
    border-bottom: 0 solid rgba(7, 17, 27, .1);
    @include border-bottom-1px();

    .desc {
      padding-bottom: 18px;
      border-bottom: 0 solid rgba(7, 17, 27, .1);
      @include border-bottom-1px();

      .name {
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        margin-bottom: 8px;
      }

      .rating {
        font-size: 0;
      }

      .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }

      .rating-count {
        display: inline-block;
        font-size: 10px;
        line-height: 18px;
        color: rgb(77, 85, 93);
        margin-right: 12px;
      }

      .sell-count {
        display: inline-block;
        font-size: 10px;
        line-height: 18px;
        color: rgb(77, 85, 93);
      }
    }

    .delivery {
      display: flex;
      padding-top: 18px;

      .delivery-item {
        flex: 1;
        border-right: 0 solid rgba(7, 17, 27, .1);
        /*.border-w(0, 1px, 0, 0);*/
        text-align: center;

        &:last-child {
          border-right: none;
        }

        h1 {
          font-size: 10px;
          line-height: 10px;
          color: rgb(147, 153, 159);
          margin-bottom: 4px;
        }

        span {
          font-size: 24px;
          line-height: 24px;
          color: rgb(7, 17, 27);
        }

        i {
          font-style: normal;
          font-size: 10px;
        }
      }
    }

    .favorite {
      position: absolute;
      top: 18px;
      right: 18px;
      width: 50px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }

  .bulletin {
    background-color: #fff;
    border: 0 solid rgba(7, 17, 27, .1);
    /*.border-w(1px, 0, 1px, 0);*/
    .title {
      padding: 18px 18px 0 18px;
      font-size: 14px;
      line-height: 14px;
      color: rgb(7, 17, 27);
    }

    .content {
      margin-top: 8px;
      padding: 0 30px 16px 30px;
      font-size: 12px;
      line-height: 24px;
      color: rgb(240, 20, 20);
    }

    .supports {
      padding: 0 18px;

      .support-item {
        padding: 16px 12px;
        border: 0 solid rgba(7, 17, 27, .1);
        /*.border-w(1px, 0, 0, 0);*/
        font-size: 0;

        .icon {
          display: inline-block;
          vertical-align: top;
          background-size: 16px 16px;
          margin-right: 6px;
          width: 16px;
          height: 16px;

          &.decrease {
            @include bg-image('../../components/seller/decrease_4');
          }

          &.discount {
            @include bg-image('../../components/seller/discount_4');
          }

          &.guarantee {
            @include bg-image('../../components/seller/guarantee_4');
          }

          &.invoice {
            @include bg-image('../../components/seller/invoice_4');
          }

          &.special {
            @include bg-image('../../components/seller/special_4');
          }
        }

        .text {
          display: inline-block;
          font-size: 12px;
          line-height: 16px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }

  .pics {
    margin-top: 16px;
    padding: 18px;
    background-color: #fff;
    border: 0 solid rgba(7, 17, 27, .1);
    /*.border-w(1px, 0, 1px, 0);*/
    .title {
      margin-bottom: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;

        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;

          &:last-child {
            margin: 0
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);
    background-color: #fff;
    margin-top: 16px;
    border: 0 solid rgba(7, 17, 27, 0.1);
    /*.border-w(1px, 0, 0, 0);*/
    .title {
      padding-bottom: 12px;
      line-height: 14px;
      border-bottom: 0 solid rgba(7, 17, 27, 0.1);
      @include border-bottom-1px();
      font-size: 14px;
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;
      font-size: 12px;
      border-bottom: 0 solid rgba(7, 17, 27, 0.1);
      @include border-bottom-1px();

      &:last-child {
        border: none;
      }
    }
  }
</style>
