<template>
  <div id="login" class="row">

    <div class="container">
      <div class="row no-gutters">
        <div class="col-md-8 col-lg-7 col-xl-6 offset-md-2 offset-lg-2 offset-xl-3 u-space-3 u-space-0--lg">
          <!-- Form -->
          <form class="js-validate mt-5">
            <!-- Title -->
            <div class="mb-7">
              <h2 class="h3 text-primary font-weight-normal mb-0">欢迎 <span class="font-weight-bold">回来</span></h2>
              <p>登录您的账户</p>
            </div>
            <!-- End Title -->

            <!-- Input -->
            <div class="js-form-message mb-4">
              <label class="h6 small d-block text-uppercase">用户名</label>

              <div class="js-focus-state input-group u-form">
                <input type="text" class="form-control u-form__input" name="username" required
                       v-model="username"
                       placeholder="请输入用户名"
                       aria-label=""
                       data-msg=""
                       data-error-class="u-has-error"
                       data-success-class="u-has-success">
              </div>
            </div>
            <!-- End Input -->

            <!-- Input -->
            <div class="js-form-message mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <label class="h6 small d-block text-uppercase">密码</label>
              </div>

              <div class="js-focus-state input-group u-form">
                <input type="password" class="form-control u-form__input" name="password" required
                       v-model="password"
                       placeholder="请输入密码"
                       aria-label="********"
                       data-msg=""
                       data-error-class="u-has-error"
                       data-success-class="u-has-success">
              </div>
            </div>
            <!-- End Input -->

            <!-- Input -->
            <div class="js-form-message mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <label class="h6 small d-block text-uppercase">验证码</label>
              </div>

              <div class="js-focus-state input-group u-form">
                <my-vcode label-text="" img-id="kaptchaImage" v-model="vcode"></my-vcode>
              </div>
            </div>
            <!-- End Input -->

            <!-- Button -->
            <div class="row align-items-center mb-5">
              <div class="col-12 text-center">
                <button type="button" class="btn btn-primary u-btn-primary transition-3d-hover" @click.stop="login()">登录</button>
              </div>
            </div>
            <!-- End Button -->
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import MyButton from '../../components/my-button.vue'
import MyInput from '../../components/my-input.vue'
import MyVcodeInput from '../../components/my-vcode.vue'
import { getLoginInfo, getUserInfo } from '../../api/wwopen.js'
import $ from 'jquery'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput,
    'my-vcode': MyVcodeInput
  },
  data () {
    return {
      username: '',
      password: '',
      vcode: '',
      errMsg: '',
      errAlert: false,
      justLogout: false
    }
  },
  computed: {
    authCode () { return this.$store.state.wwopen.authCode },
    code () { return this.$store.state.wwopen.code },
    headimgurl () { return this.$store.state.wwopen.avatar },
    logined () { return this.$store.state.logined },
    isAdmin () { return this.$store.state.isAdmin },
    sessionUsername () {
      var username = this.$store.state.username
      if (username.length === 0) {
        // username = $.cookie('username')
        if (username === undefined) username = ''
      }
      return username
    },
    fullname () { return this.$store.state.fullname },
    historyStep () { return this.$store.state.historyStep },
    userInfo () { return this.$store.state.userInfo },
    openid () {
      var openid = this.$store.state.wxInfo.openid
      if (openid.length === 0) {
        // openid = $.cookie('openid')
        if (openid === undefined) openid = ''
      }
      return openid
    },
    nickname () {
      var nickname = this.$store.state.wxInfo.nickname
      if (nickname.length === 0) {
        // nickname = $.cookie('nickname')
        if (nickname === undefined) nickname = ''
      }
      return nickname
    }    
  },
  mounted: function () {
    if (this.logined === false) {
      var username = $.cookie('username')
      var token = $.cookie('token')
      if (username !== undefined && token !== undefined) {
        this.$store.commit('setUsername', { 'username': username, 'logined': true })
      }
    }

    // console.log(this.authCode)
    // console.log(this.code)
    if (!this.logined) {
      if (this.authCode !== null && this.authCode.length > 0) {
        this.getLoginInfo()  
      } else if (this.code !== null && this.code.length > 0) {
        this.getWwUserInfo()
      } else {
        this.refreshKaptcha()
      }     
    }
    // console.log(this.authCode)
  },
  updated: function () {
    if (this.logined === false && this.justLogout) {
      this.justLogout = false
      this.refreshKaptcha()

      var self = this
      $('#kaptchaImage').click(self.refreshKaptcha)
    }
  },
  methods: {
    showErrMsg: function (msg) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg })
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },    
    login: function () {
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/login',
        data: { 'username': this.username, 'password': this.password, 'captchaValue': this.vcode },
        dataType: 'json',
        success: function (jsonResult) {
          // console.log(jsonResult);
          if (jsonResult.status === 'OK') {
            var u = {
              'username': jsonResult.username,
              'logined': true,
              'fullname': jsonResult.fullname,
              'isAdmin': jsonResult.userId === jsonResult.enterpriseId
            }
            self.$store.commit('setUsername', u)

            $.cookie('token', jsonResult.token, { expires: 30, path: '/' })
            $.cookie('username', jsonResult.username, { expires: 30, path: '/' })
            $.cookie('fullname', jsonResult.fullname, { expires: 30, path: '/' })

            self.$router.push("/orders")

          } else {
            if (jsonResult.errMsg !== null) {
              self.showErrMsg(jsonResult.errMsg)
            } else {
              self.showErrMsg('登录失败')
            }
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
      })
    },
    checkLoginStatus: function () {
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/chklogin',
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.$store.commit('setUsername', { 'username': jsonResult.username, 'logined': true })

            $.cookie('username', jsonResult.username, { expires: 30, path: '/' })
            $.cookie('fullname', jsonResult.fullname, { expires: 30, path: '/' })

            const avatar = $.cookie('avatar')
            if (avatar !== null) {
              console.log("avatar: " + avatar)
              this.$store.dispatch('setWwopenAvatar', avatar)  
            }

            self.searchBalance()
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
      })
    },
    logout: function () {
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/logout0',
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.justLogout = true
            self.$store.commit('logout')
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
      })
    },
    refreshKaptcha: function () {
      $('#kaptchaImage').attr('src',
        '/Flight/captcha/getCaptchaCode.do?' + Math.floor(Math.random() * 100)).fadeIn()
    },
    getLoginInfo: function () {
      if (this.authCode === null || this.authCode.length === 0) {
        return
      }

      const params = {
        'authCode': this.authCode
      }

      this.showLoading('自动登录中...')

      getLoginInfo(params,
        v => {
          if (v.status === 'OK') {
            // 登录成功
            const u = {
              'username': v.username,
              'logined': true,
              'fullname': v.fullname,
              'isAdmin': v.userId === v.enterpriseId
            }
            this.$store.commit('setUsername', u)
            this.$store.dispatch('setWwopenAvatar', v.avatar)

            $.cookie('token', v.token, { expires: 30, path: '/' })
            $.cookie('username', v.username, { expires: 30, path: '/' })
            $.cookie('fullname', v.fullname, { expires: 30, path: '/' })
            $.cookie('avatar', v.avatar, { expires: 30, path: '/' })
          } else {
            this.showErrMsg('请手工登录')
          }
        },
        () => { this.hideLoading() }
      )
    },
    getWwUserInfo: function () {
      const params = {
        'code': this.code,
        'state': ''
      }
      this.showLoading('自动登录中...')
      getUserInfo(params,
        v => {
          if (v.status === 'OK') {
            // 登录成功
            const u = {
              'username': v.username,
              'logined': true,
              'fullname': v.fullname,
              'isAdmin': v.userId === v.enterpriseId
            }
            this.$store.commit('setUsername', u)
            this.$store.dispatch('setWwopenAvatar', v.avatar)

            $.cookie('token', v.token, { expires: 30, path: '/' })
            $.cookie('username', v.username, { expires: 30, path: '/' })
            $.cookie('fullname', v.fullname, { expires: 30, path: '/' })
            $.cookie('avatar', v.avatar, { expires: 30, path: '/' })
          } else {
            this.showErrMsg('请手工登录')
          }   
        },
        () => { this.hideLoading() }
      )
    }
  }
}
</script>
