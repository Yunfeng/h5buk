<template>
  <div id="tmc-home" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      机票政策
    </div> 

    <div class="weui-grids mt-2 col-12 px-0">
      <router-link to="/tmc/list" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label text-primary">
              特殊政策
          </p>
      </router-link>
      <router-link to="/tmc/buy" class="weui-grid bg-danger text-white">
          <div class="weui-grid__icon">
              <i class="fa fa-jpy fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label text-white">采购</p>
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
