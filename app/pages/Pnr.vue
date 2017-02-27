<template>
  <div id="pnr-home" class="container">
    <div class="row">
      <div class="col-12 bg-info">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
    </div> 
    <div class="weui-grids mt-2">
      <router-link to="/pnr/list" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              PNR列表
          </p>
      </router-link>
      <router-link to="/pnr/alert1" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              待取消
          </p>
      </router-link>
      <router-link to="/pnr/ctcm" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              缺CTCM
          </p>
      </router-link>
      <router-link to="/pnr/mobile" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              备用手机号
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
