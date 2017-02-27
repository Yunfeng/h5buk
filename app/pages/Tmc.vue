<template>
  <div id="tmc-home" class="container">
    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="weui-grids mt-2">
      <router-link to="/tmc/list" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              特殊政策
          </p>
      </router-link>
      <router-link to="/tmc/buy" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-jpy fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              采购
          </p>
      </router-link>
      <router-link to="/order" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-book fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              订单
          </p>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    back: function () {
      this.$router.go(-1)
    }
  }
}
</script>
