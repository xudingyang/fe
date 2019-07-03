<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click.stop.prevent="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="name">{{food.name}}</div>
          <div class="extra">
            <span class="count">月售{{food.sellCount}}份</span>
            <span class="good-rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="currPrice"><i class="rmb">￥</i>{{food.price}}</span><span class="oldPrice"
                                                                                   v-show="food.oldPrice"><i
            class="rmb">￥</i>{{food.oldPrice}}</span>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addCart">加入购物车</div>
          </transition>
          <div class="addBtn-wrapper" v-show="food.count">
            <addFoodBtn :food="food" @add="addFood"></addFoodBtn>
          </div>
        </div>
        <div class="desc" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingCtl :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                     @select="selectRating" @toggle="toggleContent"></ratingCtl>
          <div class="rating-wrapper">
            <ul>
              <li class="rating-item" v-for="(rating,index) in food.ratings" :key="index" v-show="showRating(rating.rateType,rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>&nbsp;{{rating.text}}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import addFoodBtn from '../addFoodBtn/addFoodBtn.vue'
  import Vue from 'vue'
  import ratingCtl from '../ratingctl/ratingctl.vue'
  import { formatDate } from '../../common/js/date'

  const ALL = 2
  export default {
    name: 'food',
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show () {
        this.showFlag = true
        // 因为ratingctl这个组件会被多次引用，所以每次引用都初始化一次较合适
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          // 因为show方法会多次调用，所以这个值不确定的，只要show了就变得可以滑动
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      showRating (rateType, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return rateType === this.selectType
        }
      },
      hide () {
        this.showFlag = false
      },
      addFood (target) {
        this.$emit('add', target)
      },
      addCart (event) {
        if (!event._constructed) {
          return
        }
        this.$emit('add', event.target)
        Vue.set(this.food, 'count', 1)
      },
      selectRating (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      toggleContent () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      addFoodBtn, ratingCtl
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

  .food {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    width: 100%;
    z-index: 30;
    background-color: #f3f5f7;
    transform: translate3d(0, 0, 0);

    &.move-enter-active, &.move-leave-active {
      transition: all .2s linear
    }

    &.move-enter, &.move-leave-active {
      transform: translate3d(100%, 0, 0)
    }

    .food-content {
      padding-bottom: 20px;
    }

    .image-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .back {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 20px;
        color: #fff;
      }
    }

    .content {
      position: relative;
      padding: 18px;
      margin-bottom: 18px;
      background-color: #fff;
      border-bottom: 0 solid rgba(7, 17, 27, 0.1);
      /*.border-w(0, 0, 1px, 0);*/
      .name {
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
        line-height: 14px;
        margin-bottom: 8px;
      }

      .extra {
        font-size: 10px;
        color: rgb(147, 153, 159);
        line-height: 10px;
        margin-bottom: 18px;

        .count {
          margin-right: 12px;
        }
      }

      .price {
        line-height: 24px;
        height: 24px;
      }

      .currPrice {
        font-size: 14px;
        font-weight: 700;
        color: rgb(240, 20, 20);
        margin-right: 12px;
      }

      .oldPrice {
        font-weight: 700;
        font-size: 10px;
        color: rgb(147, 153, 159);
        text-decoration: line-through;
      }

      .rmb {
        font-size: 10px;
        font-weight: normal;
        font-style: normal;
      }

      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        width: 74px;
        height: 24px;
        background-color: rgb(0, 160, 220);
        border-radius: 12px;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        color: rgb(255, 255, 255);
        opacity: 1;

        &.fade-enter-active, &.fade-leave-active {
          transition: all .2s linear
        }

        &.fade-enter, &.fade-leave-active {
          width: 0;
          opacity: 0;
        }
      }

      .addBtn-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
    }

    .desc {
      padding: 18px;
      margin-bottom: 18px;
      background-color: #fff;
      border: 0 solid rgba(7, 17, 27, 0.1);
      /*.border-w(1px, 0, 1px, 0);*/
      .title {
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .text {
        line-height: 24px;
        padding: 0 8px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }

    .rating {
      background-color: #fff;
      padding-top: 18px;

      .title {
        margin-left: 18px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .rating-wrapper {
        padding: 0 18px;
      }

      .rating-item {
        position: relative;
        padding: 16px 0;
        border-bottom: 0 solid rgba(7, 17, 27, 0.1);
        /*.border-w(0, 0, 1px, 0);*/
        .user {
          position: absolute;
          right: 0;
          top: 16px;
          line-height: 12px;
          font-size: 0;

          .name {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }

          .avatar {
            border-radius: 50%;
          }
        }

        .time {
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .text {
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }

          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>
