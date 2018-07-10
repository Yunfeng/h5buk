<template>
  <div id="app" class="container">
    <my-loading></my-loading>
    <top-tips></top-tips>

    <transition name="fade">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition  name="fade" mode="out-in" :duration="{ enter: 50, leave: 300 }">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>


    <div class="row mb-5">
      &nbsp;
    </div>
    <bottom-tabbar v-if="logined"></bottom-tabbar>
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
      logined () { return this.$store.state.logined }
    }
  }
</script>