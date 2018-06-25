<template>
  <div id="app" class="container">
    <my-loading></my-loading>
    <top-tips></top-tips>

    <router-view></router-view>

    <div class="row mb-5">
      &nbsp;
    </div>
    <bottom-tabbar></bottom-tabbar>
  </div>
</template>

<script>
  import BottomTabbar from './components/my-bottom-tabbar.vue'  
  import TopTips from './components/my-top-tips.vue'	
  import MyLoading from './components/my-loading.vue'

  export default {
    components: {
      BottomTabbar,
      TopTips,
      MyLoading
    },
    computed: {
      workMode () { return this.$store.state.workMode }
    }
  }
</script>