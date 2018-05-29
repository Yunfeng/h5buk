<template>
  <div id="pnr-home" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa02" aria-hidden="true"></i>
      </span>
      PNR主页
    </div> 
    <div class="weui-grids mt-2 col-12">
      <router-link to="/pnr/list" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              PNR列表
          </p>
      </router-link>
      <router-link to="/pnr/stat" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              PNR统计
          </p>
      </router-link>
      <router-link to="/pnr/ctcm" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              缺 CTCM
          </p>
      </router-link>
      <router-link to="/pnr/ctct" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              缺 CTCT
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
      <router-link to="/pnr/syslog" class="weui-grid">
          <div class="weui-grid__icon">
              <i class="fa fa-info fa-2" aria-hidden="true"></i>
          </div>
          <p class="weui-grid__label">
              系统日志
          </p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PnrHome',
  methods: {
    back: function () {
      this.$router.go(-1)
    }
  }
}
</script>
