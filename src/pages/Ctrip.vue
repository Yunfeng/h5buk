<template>
  <div id="pnr-home" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa02" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      携程比价
    </div> 
    <div class="weui-grids mt-2 col-12">
      <router-link to="/ctrp/policies" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              特殊政策
          </p>
      </router-link>
      <router-link to="/ctrp/price" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              底价管理
          </p>
      </router-link>
      <router-link to="/ctrp/sync" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              政策同步
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
