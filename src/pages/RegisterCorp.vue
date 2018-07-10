<template>
  <div id="register" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      企业微信免费安装应用
    </div> 
    <div class="card col-12">
      <div class="card-body text-center">
        已有企业微信
        <button class="btn btn-warning" @click.stop="getRedirect1()">免费安装</button>
      </div>
      <div class="card-body text-center">
        暂无企业微信
        <button class="btn btn-primary">注册企业微信</button>
      </div>
    </div>
    

  </div>
</template>

<script>
import { getWwopenPreAuthCode } from '../api/user.js'

export default {
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    getRedirect1: function (val) {
      getWwopenPreAuthCode( v => {
        console.log(v)
        window.open(v)
      })
    }
  }
}
</script>
