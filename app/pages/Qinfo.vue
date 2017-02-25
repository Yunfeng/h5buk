<template>
  <div id="qinfo-home" class="container">
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
    back: function() {
      this.$router.go(-1);
    } 
  }
}

</script>