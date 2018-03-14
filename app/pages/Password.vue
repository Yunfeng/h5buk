<template>
  <div id="register" class="row">

    <div class="card col-12">
      <div class="card-header text-center">
        找回密码
      </div>
      <div class="card-block">
        <form>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="手机号"  v-model="mobile">
            <small class="form-text text-muted">注册时填写的手机号</small>
          </div>
          <div class="form-group">
            <div class="row no-gutters">
              <div class="col-6">
                <input type="input" class="form-control" placeholder="验证码" v-model="vcode">
              </div>
              <div class="col-6">
                <img id="kaptchaImage1" class="img-fluid  pl-1" alter="点击图片刷新" />                    
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-success btn-block" type="button" @click.stop="findPassword()">找回密码</button>
      </div>
    </div>

    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      vcode: '',
      mobile: '',

      errMsg: '',
      errAlert: false,

      loading: false,
      loadingText: '数据加载中'
    }
  },
  mounted: function () {
    $('#kaptchaImage1').click(function () {
      $(this).attr('src',
        '/Flight/captcha/getCaptchaCode.do?' + Math.floor(Math.random() * 100)).fadeIn()
    })
    $('#kaptchaImage1').click()
  },
  methods: {
    findPassword: function () {
      var self = this

      self.loading = true
      self.loadingText = '注册中...'

      $.ajax({
        type: 'post',
        url: '/Flight/find-password',
        data: {
          'mobile': this.mobile,
          'captchaValue': this.vcode
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.loading = false
          if (jsonResult.status === 'OK') {
            self.showErrMsg('成功，' + jsonResult.desc)
            self.waitForJump()
          } else {
            if (jsonResult.errmsg !== null) {
              self.showErrMsg(jsonResult.errmsg)
            } else {
              self.showErrMsg('失败')
            }
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
        }
      })
    },
    showErrMsg: function (msg) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg })
    },
    waitForJump: function () {
      setTimeout(() => this.$router.push('/login'), 1500)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.');
    })
  }
}
</script>
