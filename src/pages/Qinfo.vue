<template>
  <div id="qinfo-setting" class="row">
    <div class="col-12 bg-info text-center text-white fa-2 sticky-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      Q信息
    </div> 

    <div class="weui-grids col-12 mt-2">
        <router-link to="/qinfo/list" class="weui-grid">
            <div class="weui-grid__icon">
                <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
            </div>
            <p class="weui-grid__label">
                Q 列表
            </p>
        </router-link>
        <router-link to="/qinfo/setting" class="weui-grid">
            <div class="weui-grid__icon">
                <i class="fa fa-cog fa-2" aria-hidden="true"></i>
            </div>
            <p class="weui-grid__label">
                设置
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
