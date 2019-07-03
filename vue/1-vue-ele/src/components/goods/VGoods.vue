<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          class="menu-item"
          v-for="(item, index) in goods"
          :class="{current:currentIndex===index}"
          @click="selectMenu(index,$event)"
          :key="index"
        >
          <span class="text">
            <i
              v-show="item.type>0"
              class="icon"
              :class="iconClassMap[item.type]"
            ></i>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item, index) in goods" class="food-list" ref="foodList" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, index) in item.foods" class="food-item" @click="selectFood(food,$event)" :key="index">
              <div class="icon">
                <img height="57" width="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span class="good-rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="currPrice"><i class="rmb">￥</i>{{food.price}}</span><span class="oldPrice"
                                                                                         v-show="food.oldPrice"><i
                  class="rmb">￥</i>{{food.oldPrice}}</span>
                </div>
                <div class="addBtn-wrapper">
                  <addFoodBtn :food="food" @add="addFood"></addFoodBtn>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <cart
      ref="cart"
      :deliveryPrice="seller.deliveryPrice"
      :minPrice="seller.minPrice"
      :selectFoods="selectFoods"
    ></cart>
    <food :food="selectedFood" ref="food" @add="addFood"></food>
  </div>

</template>

<script>
  import cart from '../cart/cart.vue'
  import addFoodBtn from '../addFoodBtn/addFoodBtn.vue'
  import food from '../food/food.vue'

  import BScroll from 'better-scroll'

  const ERR_OK = 0

  export default {
    name: 'goods',
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {},
        iconClassMap: []
      }
    },
    created () {
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      this.$http.get('/api/goods').then((res) => {
        res = res.data
        if (res.errno === ERR_OK) {
          this.goods = res.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    computed: {
      // 根据scrollY计算左边的currentIndex的值
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        // 观测的是goods对象
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      // 初始化better-scroll
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // probeType: 3 是BScroll的参数，表示实时监听滚动的位置
          probeType: 3,
          // 让这个元素能够相应点击事件。这时候有个问题：这个BScroll的点击事件，浏览器的原生点击事件也存在，需要屏蔽掉浏览器的事件
          click: true
        })
        // better-scroll里面的监听方法，返回滚动元素的位置
        this.foodsScroll.on('scroll', (pos) => {
          // pos是负值而且是小数，转为整数和正值。得到了滚动位置后，在computed里把位置与左侧菜单映射起来
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodList
        let height = 0
        this.listHeight.push(height) // push第0个的height
        for (let i = 0; i < foodList.length; i++) { // push其他的height
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu (index, event) {
        if (!event._constructed) {
          return
        }
        // 只有BScroll才有_constructed这个属性，在pc浏览器上可以过滤掉pc的点击事件
        let foodList = this.$refs.foodList
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      },
      addFood (target) {
        this._drop(target)
      },
      _drop (target) {
        // 因为add按钮还有滚动的动画效果，所以这个动画异步执行才会流畅，体验好一点
        this.$nextTick(() => {
          this.$refs.cart.drop(target)
        })
      }
    },
    components: {
      cart, addFoodBtn, food
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/scss/mixin";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;

    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;

      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height: 14px;

        &.current {
          /*position: relative;*/
          /*z-index: 10;*/
          margin-top: -1px;
          background: #fff;
          font-weight: 700;

          .text {
            border: none;
          }
        }

        &:last-child {
          .text {
            border: none;
          }
        }

        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          /*.border-w(0, 0, 1px, 0);*/
          border-style: solid;
          border-color: rgba(7, 17, 27, 0.1);
          font-size: 12px;

          .icon {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            margin-right: 2px;
            background-size: 12px 12px;
            background-repeat: no-repeat;

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
        }
      }
    }

    .foods-wrapper {
      flex: 1;
      background-color: #f3f5f7;

      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }

      ul {
        background-color: #fff;
      }

      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        border: 0 solid rgba(7, 17, 27, 0.1);
        /*.border-w(0, 0, 1px, 0);*/
        &:last-child {
          margin-bottom: 0;
          border: none;
        }

        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }

        .content {
          flex: 1;
          position: relative;

          .name {
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 14px;
            margin-top: 2px;
            margin-bottom: 8px;
          }

          .description {
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 10px;
            margin-bottom: 8px;
          }

          .extra {
            font-size: 0;
            color: rgb(147, 153, 159);
            line-height: 10px;

            .count {
              margin-right: 12px;
              font-size: 10px;
            }

            .good-rating {
              font-size: 10px;
            }
          }

          .price {
            line-height: 24px;
            // 这个700选中不了下边的currPrice和oldPrice
            /*font-weight: 700;*/
            height: 24px;

            .currPrice {
              font-size: 14px;
              line-height: 24px;
              color: rgb(255, 0, 0);
              margin-right: 12px;
              font-weight: 700;
            }

            .oldPrice {
              color: rgb(147, 153, 159);
              font-size: 10px;
              font-weight: 700;
              text-decoration: line-through;
            }

            .rmb {
              font-weight: normal;
              font-style: normal;
              font-size: 10px;
            }
          }

          .addBtn-wrapper {
            position: absolute;
            right: 0;
            bottom: -6px;
          }
        }
      }
    }
  }
</style>
