<template>
  <div id="register" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      关注微信公众号
    </div> 
    <div class="card col-12">
      <div class="card-body">
        <img src="/public/images/qrcode_for_gh_5066f04ad73b_258.jpg" class="rounded mx-auto d-block" alt="迎航商旅通">
      </div>
      <div class="card-body text-center">
        1. 请打开微信，扫描上方二维码，关注我们的微信公众号<br />
        2. 进入公众号 <br />
        3. 点"会员享" -> "我" <br />
        4. 点“修改”，设置登录用户名和密码 <br />
        5. 使用用户名和密码登录系统
      </div>
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
