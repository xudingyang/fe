<template>
  <div class="hello">
    <div class="outer">
      <span class="button" @click="receiveRewards">点击领取</span>
      <transition name="jump">
        <span class="num" v-if="jumpNumberVisible">+5</span>
      </transition>
      <div class="pos">跳跃</div>
    </div>
  </div>
</template>

<script>
  import DigitRoll from '@huoyu/vue-digitroll';

  export default {
    name: 'HelloWorld',
    components: {
      DigitRoll
    },
    data () {
      return {
        jumpNumberVisible: false,
        startVal: 0,
        endVal: 0,
        digits: 0,
        deltaX: 0
      }
    },
    methods: {
      receiveRewards () {
        // this.jumpNumberVisible = !this.jumpNumberVisible
        // this.digits += 17
        this.$nextTick(() => {
          let pos = document.getElementsByClassName('pos')[0]
          this.deltaX += 50
          pos.style.transform = 'translateX(' + this.deltaX + 'px)'
          console.log(pos.style.transform)
        })
      },
      restart () {
        const random = `${Math.random()}`.substr(2).substr(0, 4);
        setTimeout(() => {
          this.digits = random;
        }, 400);
      }
    }
  }
</script>

<style scoped>
  .outer {
    width: 200px;
    height: 100px;
    border: 1px solid #ccc;
    position: relative;
  }

  .button {
    display: inline-block;
    width: 100px;
    height: 30px;
    background: #0fdea1;
    color: #fff;
    cursor: pointer;
  }

  .pos {
    position: absolute;
    top: 30px;
    transform: translateX(0);
    transition: 3s;
  }

  .num {
    position: absolute;
    left: 100px;
    top: 0;
    opacity: 0;
    font-size: 0;
    transform: translate3d(0, 0, 0);
  }

  .jump-enter {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }

  .jump-enter-active, .jump-leave-active {
    transition: all .8s ease-out;
  }

  .jump-enter-to, .jump-leave {
    opacity: 1;
    font-size: 18px;
    transform: translate3d(50px, -50px, 0);
  }

  .jump-leave-to {
    opacity: 0;
  }
</style>
