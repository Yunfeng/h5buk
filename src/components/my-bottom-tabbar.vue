<template>
  <div class="row col-12 fixed-bottom" style="opacity: 0.9;">
    <div class="weui-tabbar">
      <router-link to="/search" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
            <i class="fa fa-plane fa-2 text-primary" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            机票
        </p>
      </router-link>

      <router-link to="/policies" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
          <i class="fa fa-home fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">政策</p>
      </router-link>

      <router-link to="/orders" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
          <i class="fa fa-home fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">订单</p>
      </router-link>
      
      <router-link to="/login" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
          <i class="fa fa-user-circle fa-2" aria-hidden="true"></i>
        </div>                    
        <p class="weui-tabbar__label">我</p>
      </router-link>      
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    flightCount () { return 1 }
  }
}
</script>
