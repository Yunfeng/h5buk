<template>
  <div id="register" class="row">
    <div class="card col-12">
      <div class="card-header text-center">
        注册
      </div>
      <div class="card-block">
        <form>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="登录用户名"  v-model="username">
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="密码"  v-model="password">
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="姓名"  v-model="realname">
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="手机号"  v-model="mobile">
            <small class="form-text text-success">需要时可通过手机号找回密码</small>
          </div>
          <div class="form-group" v-if="openid.length === 0">
            <div class="row no-gutters">
              <div class="col-6">
                <input type="input" class="form-control" placeholder="验证码" v-model="vcode">
              </div>
              <div class="col-6">
                <img id="kaptchaImage1" class="img-fluid" alter="点击图片刷新" />                    
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-success btn-block" type="button" @click.stop="register()">注册</button>
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
      username: '',
      password: '',
      vcode: '',
      realname: '',
      mobile: '',

      errMsg: '',
      errAlert: false,

      loading: false,
      loadingText: '数据加载中'
    }
  },
  computed: {
    logined () { return this.$store.state.logined },
    sessionUsername () { return this.$store.state.username },
    historyStep () { return this.$store.state.historyStep },
    userInfo () { return this.$store.state.userInfo },
    openid () {
      var openid = this.$store.state.wxInfo.openid
      if (openid.length === 0) {
        openid = $.cookie('openid')
        if (openid === undefined) openid = ''
      }
      return openid
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
    register: function () {
      var self = this

      self.loading = true
      self.loadingText = '注册中...'

      $.ajax({
        type: 'post',
        url: '/Flight/register',
        data: {
          'username': this.username,
          'password': this.password,
          'realname': this.realname,
          'mobile': this.mobile,
          'captchaValue': this.vcode,
          'openid': this.openid
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.loading = false

          if (jsonResult.status === 'OK') {
            self.showErrMsg('注册成功，稍后自动跳转到登录页面')
            self.waitForJump()
          } else {
            if (jsonResult.errmsg !== null) {
              self.showErrMsg(jsonResult.errmsg)
            } else {
              self.showErrMsg('注册失败')
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
    })
  }
}

</script>
