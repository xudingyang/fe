<template>
  <div class="ratingctl">
    <div class="rating-type">
      <span @click="select(2,$event)" class="rt all" :class="{'active':selectType===2}">{{desc.all}}<i
        class="count">{{ratings.length}}</i></span>
      <span @click="select(0,$event)" class="rt positive" :class="{'active':selectType===0}">{{desc.positive}}<i
        class="count">{{positives.length}}</i></span>
      <span @click="select(1,$event)" class="rt negative" :class="{'active':selectType===1}">{{desc.negative}}<i
        class="count">{{negatives.length}}</i></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    name: 'ratingctl',
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives () {
        // ES6的filter方法，用于对数组过滤
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negatives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return
        }
        this.$emit('select', type)
      },
      toggleContent (event) {
        if (!event._constructed) {
          return
        }
        this.$emit('toggle')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/mixin";

  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    border-bottom: 0 solid rgba(7, 17, 27, 0.1);
    @include border-1px(0, 0, 1px, 0);
    font-size: 0px;

    .rt {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      line-height: 16px;
      border-radius: 1px;
      font-size: 12px;
      color: rgb(77, 85, 93);

      .count {
        margin-left: 2px;
        font-size: 8px;
        font-style: normal;
      }
    }

    .all,
    .positive {
      background: rgba(0, 160, 220, 0.2);

      &.active {
        background: rgb(0, 160, 220);
      }
    }

    .negative {
      background: rgba(77, 85, 93, 0.2);

      &.active {
        background: rgb(77, 85, 93);
      }
    }

    .active {
      color: rgb(255, 255, 255);
    }
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);
    font-size: 0;

    &.on {
      .icon-check_circle {
        color: #00c850;
      }
    }

    .icon-check_circle {
      display: inline-block;
      vertical-align: top;
      margin-right: 4px;
      font-size: 24px;
    }

    .text {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
</style>
