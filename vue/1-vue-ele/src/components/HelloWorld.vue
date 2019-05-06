<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    components: {},
    data () {
      return {
        msg: 'Welcome to Your Vue.js App啊啊'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .hello {
    p {
      font-size: 12px;
    }
  }
</style>
