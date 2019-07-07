<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import MTab from 'components/tab/tab'
  export default {
    name: 'App',
    components: {
      MHeader,
      MTab
    }
  }
</script>

<style lang="scss">
  @import "common/scss/variable.scss";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
