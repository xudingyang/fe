<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star class="star" :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star class="star" :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <ratingCtl class="rating-ctl" :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                 @select="selectRating" @toggle="toggleContent"></ratingCtl>
      <div class="rating-wrapper">
        <ul>
          <li class="reting-item" v-for="(rating, index) in ratings" :key="index" v-show="showRating(rating.rateType,rating.text)">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <div class="name">{{rating.username}}</div>
              <div class="score-star">
                <star class="star" :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon"
                      :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from '../star/star.vue'
  import ratingCtl from '../ratingctl/ratingctl.vue'
  import { formatDate } from '../../common/js/date'
  import BScroll from 'better-scroll'

  const ALL = 2
  const ERR_OK = 0

  export default {
    name: 'ratings',
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    created () {
      this.$http.get('api/ratings').then((res) => {
        let response = res.data
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      })
    },
    methods: {
      selectRating (selectType) {
        this.selectType = selectType
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      toggleContent () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      showRating (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return this.selectType === type
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      star,
      ratingCtl
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/scss/mixin';

  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    background-color: #f3f5f7;
  }

  .overview {
    background-color: #fff;
    display: flex;
    padding: 18px 0;
    border-bottom: 0 solid rgba(7, 17, 27, 0.1);
    @include border-1px(0, 0, 1px, 0);
    margin-bottom: 18px;
  }

  .overview-left {
    flex: 0 0 137px;
    padding: 6px 0;
    width: 137px;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
    text-align: center;
    // 设计稿没有考虑到5s小屏幕的情况，这里考虑一下
    @media only screen and (max-width: 320px) {
      flex: 0 0 120px;
      width: 120px;
    }

    .score {
      margin-bottom: 6px;
      line-height: 28px;
      font-size: 24px;
      color: rgb(255, 153, 0);
    }

    .title {
      margin-bottom: 8px;
      line-height: 12px;
      font-size: 12px;
      color: rgb(7, 17, 27);
    }

    .rank {
      line-height: 10px;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
  }

  .overview-right {
    flex: 1;
    padding: 0 24px;
    @media only screen and (max-width: 320px) {
      padding: 0 4px;
    }

    .score-wrapper {
      margin-bottom: 8px;
      font-size: 0;

      .score {
        display: inline-block;
        line-height: 18px;
        vertical-align: top;
        font-size: 12px;
        color: rgb(255, 153, 0);
      }
    }

    .delivery-wrapper {
      font-size: 0;

      .delivery {
        display: inline-block;
        font-size: 12px;
        line-height: 18px;
        margin-left: 12px;
        color: rgb(147, 153, 159);
      }
    }

    .title {
      display: inline-block;
      font-size: 12px;
      line-height: 18px;
      color: rgb(7, 17, 27);
    }

    .star {
      display: inline-block;
      margin: 0 12px;
      vertical-align: top;
    }
  }

  .rating-ctl {
    background-color: #fff;
  }

  .rating-wrapper {
    background-color: #fff;
    padding: 0 18px;
  }

  .reting-item {
    display: flex;
    padding: 18px 0;
    border-bottom: 0 solid rgba(7, 17, 27, .1);
    @include border-1px(0, 0, 1px, 0);

    .avatar {
      flex: 0 0 28px;
      width: 28px;
      margin-right: 12px;

      img {
        border-radius: 50%;
      }
    }

    .content {
      position: relative;
      flex: 1;
    }

    .name {
      font-size: 10px;
      line-height: 12px;
      color: rgb(7, 17, 27);
      margin-bottom: 4px;
    }

    .score-star {
      margin: 0 6px 6px 0;
      font-size: 0;

      .star {
        display: inline-block;
        margin-right: 6px;
        vertical-align: top;
      }

      .delivery {
        display: inline-block;
        font-size: 10px;
        line-height: 12px;
        color: rgb(147, 153, 159);
        vertical-align: top;
      }
    }

    .text {
      line-height: 18px;
      color: rgb(7, 17, 27);
      font-size: 12px;
    }

    .recommend {
      line-height: 16px;
      font-size: 0;
      margin-top: 8px;

      .icon {
        display: inline-block;
        margin-right: 8px;
        font-size: 12px;
      }

      .icon-thumb_up {
        color: rgb(0, 160, 220);
      }

      .icon-thumb_down {
        color: rgb(147, 153, 159);
      }

      .item {
        display: inline-block;
        font-size: 9px;
        margin-right: 8px;
        padding: 0 6px;
        border: 0 solid rgba(7, 17, 27, .1);
        @include border-1px(1px, 1px, 1px, 1px);
        border-radius: 1px;
        color: rgb(147, 153, 159);
      }
    }

    .time {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 12px;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
  }

</style>
