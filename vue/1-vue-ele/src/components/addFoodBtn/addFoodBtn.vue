<template>
  <div class="addFoodBtn">
    <transition name="move">
      <!-- 外层负责平移动画，里层负责旋转动画 -->
      <div class="dec-btn" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count>0" @click.stop.prevent>{{food.count}}</div>
    <div class="add-btn icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'addFoodBtn',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      decreaseCart (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      },
      addCart (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          // food里面本来是不存在count属性的，如果要给food增加这个属性，就要用到Vue.set(key,value)
          Vue.set(this.food, 'count', 1)
//          this.food.count = 1
        } else {
          this.food.count++
        }
        // 若只是计算count，则没必要传数据给父组件，因为food是引用类型，不管是谁操作都会影响food的值
        // 这里传给父组件，是要通过父组件把target传给cart组件，让cart计算小球的动画
        this.$emit('add', event.target)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .addFoodBtn {
    font-size: 0;

    .dec-btn {
      display: inline-block;
      padding: 6px;
      opacity: 1;
      transform: translate3d(0, 0, 0);

      .inner {
        display: inline-block;
        line-height: 24px;
        font-size: 24px;
        color: rgb(0, 160, 220);
        transition: all 0.4s linear;
        transform: rotate(0);
      }

      &.move-enter-active, &.move-leave-active {
        transition: all 0.4s linear;
      }

      &.move-enter, &.move-leave-active {
        opacity: 0;
        transform: translate3d(24px, 0, 0);

        .inner {
          transform: rotate(180deg);
        }
      }
    }

    .count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }

    .add-btn {
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }
  }
</style>
