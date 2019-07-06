<template>
  <div class="cart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight: totalCount>0}">
            <i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight: totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div ref="pay" class="pay" :class="payClass" @click.stop="pay">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball, index) in balls" :key="index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <!-- 抛物线是x y方向合成的，所以这里有两个方向的改变，要一里一外两个元素 -->
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="cart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="emptyFoods">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="(food, index) in selectFoods" class="food" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="addBtn-price-wrapper">
                <span class="price"><i class="rmb">￥</i>{{food.price}}</span>
                <div class="addBtn-wrapper">
                  <addFoodBtn :food="food"></addFoodBtn>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow" @touchmove.prevent></div>
    </transition>
  </div>
</template>

<script>
  import addFoodBtn from '../addFoodBtn/addFoodBtn.vue'

  import BScroll from 'better-scroll'

  export default {
    name: 'cart',
    components: {addFoodBtn},
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true // 购物车是否被折叠
      }
    },
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        // 对象或数组默认值必须从一个工厂函数获取
        default: () => []
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      /* eslint-disable */
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            // 返回一个矩形对象，包含4个属性 left、top、right和bottom
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropping (el, done) {
        // 这句是触发浏览器重绘。访问offsetHeight等属性的时候，都会重新刷新浏览器
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        // 重绘之后,动画设置才有效
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      hideList () {
        this.fold = true
      },
      emptyFoods () {
//        这里不能直接用this.selectFoods = null，因为监听的是food.count，要改变food.count才行
//   this.selectFoods = null
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      pay () {
        if (this.payDesc === '去结算') {
          window.alert(`支付${this.totalPrice}元`)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/mixin";

  .cart {
    position: fixed;
    z-index: 100;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;

    .content {
      background-color: #141d27;
      display: flex;
      font-size: 0;
      color: rgba(255, 255, 255, 0.4);

      .content-left {
        flex: 1;

        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 50%;
          background: #141d27;

          .logo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            background: #2b343c;

            &.highlight {
              background: rgb(0, 160, 220);
            }

            .icon-shopping_cart {
              line-height: 44px;
              font-size: 24px;
              color: #80858a;

              &.highlight {
                color: #fff;
              }
            }
          }

          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }

        .price {
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          padding-right: 12px;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.1); // 这里就不要搞0.5px，都快看不清了
          &.highlight {
            color: #fff;
          }
        }

        .desc {
          display: inline-block;
          font-size: 12px;
          line-height: 24px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          margin-left: 12px;
          margin-top: 12px;
          vertical-align: top;
        }
      }

      .content-right {
        flex: 0 0 105px;
        width: 105px;
        background-color: #2b333b;

        .pay {
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);

          &.not-enough {
            background: #2b333b;
          }

          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }

    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all .4s linear;
        }
      }
    }

    .cart-list {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0, -100%, 0);

      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.5s;
      }

      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0);
      }

      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        .title {
          float: left;
          font-size: 14px;
          font-weight: 200;
          color: rgb(7, 17, 27);
        }

        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }

      .list-content {
        padding: 0 30px 18px 18px;
        max-height: 217px;
        overflow: hidden;
        background-color: #fff;

        .food {
          position: relative;
          padding: 12px 0;
          border-bottom: 0px solid rgba(7, 17, 27, 0.1);
          @include border-1px(0, 0, 1px, 0);
          .name {
            font-size: 14px;
            line-height: 24px;
            color: rgb(7, 17, 27);
          }
        }
      }

      .addBtn-price-wrapper {
        position: absolute;
        right: 0;
        bottom: 6px;

        .price {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          line-height: 24px;
          color: rgb(240, 20, 20);
          margin-right: 12px;
        }

        .rmb {
          font-weight: normal;
          font-style: normal;
          font-size: 10px;
        }

        .addBtn-wrapper {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    .list-mask {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: -2;
      background-color: rgba(7, 17, 27, .6);
      filter: blur(10px);

      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.5s
      }

      &.fade-enter, &.fade-leave-active {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
      }
    }
  }
</style>
