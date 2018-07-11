<template>
  <div id="register" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      企业微信
    </div> 
    <div class="card col-12">
      <div class="card-body text-center">
        <h6>有企业微信</h6>
        <button class="btn btn-warning text-white" @click.stop="getRedirect(0)">免费安装</button>
      </div>
      <div class="card-body text-center bg-light">
        <h6>无企业微信</h6>

        <a href="javascript:void(0);" @click.stop="getRedirect(1)"><img src="//rescdn.qqmail.com/node/wwopen/wwopenmng/style/images/independent/brand/register_200x40_blue$5c038723.png" srcset="//rescdn.qqmail.com/node/wwopen/wwopenmng/style/images/independent/brand/register_200x40_blue_2x$a6d254ea.png 2x" alt="注册企业微信"></a>
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
    getRedirect: function (mode) {
      const params = {
        'register_mode': mode
      }
      getWwopenPreAuthCode(params, v => {
        console.log(v)
        window.open(v)
      })
    }
  }
}
</script>
