<template>
  <div id="login" class="row">

    <template v-if="logined === false">
      <div class="card col-12 no-gutters">
        <div class="card-header text-center text-success"  v-if="openid.length === 0">
            登录
        </div>
        <div class="media card-body border-0"  v-if="openid.length > 0">
          <img class="d-flex align-self-center mr-3" :src="headimgurl" style="width: 5rem; height: 5rem">
          <div class="media-body">
            <h5 class="mt-0">{{nickname}}</h5>
            未登录
          </div>
        </div>        
        <div class="card-body no-gutters pb-0">
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="username">
          </div>
          <div class="form-group">
              <input class="form-control" type="password" placeholder="密码" v-model="password">
          </div>
          <template v-if="openid.length === 0">
            <my-vcode label-text="验证码" img-id="kaptchaImage" v-model="vcode"></my-vcode>
          </template>
        </div>
        <div class="card-body text-center bg-faded text-white">
          <button class="btn btn-success btn-block" @click.stop="login()">登录</button> 
        </div>
        <div class="card-body text-center">

          扫码登录 适用于PC
          <a href="https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=wx22ef108e02eb000b&redirect_uri=http%3a%2f%2fyh.90sky.com%2fwwopen&state=wwopen_login&usertype=admin">
            <img src="//rescdn.qqmail.com/node/wwopen/wwopenmng/style/images/independent/brand/150x30_white$49bdfaf6.png" srcset="//rescdn.qqmail.com/node/wwopen/wwopenmng/style/images/independent/brand/150x30_white_2x$dc1f5509.png 2x" alt="企业微信登录"></a>
        </div>

      </div>
    </template>
    <template v-else>
      <div class="card col-12">
        <div class="media card-body border-0" v-if="openid.length === 0">
          <img class="d-flex align-self-center mr-3" :src="headimgurl" style="width: 5rem; height: 5rem">
          <div class="media-body">
            <h5 class="mt-0">{{fullname}}</h5>
            <small>当前用户：{{sessionUsername}}</small>
          </div>
        </div>
        <div class="media card-body border-0"  v-if="openid.length > 0">
          <img class="d-flex align-self-center mr-3" :src="headimgurl" style="width: 5rem; height: 5rem">
          <div class="media-body">
            <h5 class="mt-0">{{nickname}}</h5>
            <small>当前用户：{{sessionUsername}}</small>
          </div>
        </div>  
          
        <div class="card-footer">
          <button class="btn btn-danger btn-block" @click="logout()">退出</button>
        </div>         
      </div>      
    </template>
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

    console.log(this.authCode)
    console.log(this.code)
    if (!this.logined) {
      if (this.authCode !== null && this.authCode.length > 0) {
        this.getLoginInfo()  
      } else if (this.code !== null && this.code.length > 0) {
        this.getWwUserInfo()
      }      
    }
    console.log(this.authCode)
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
              'fullname': jsonResult.fullname
            }
            self.$store.commit('setUsername', u)

            $.cookie('token', jsonResult.token, { expires: 30, path: '/' })
            $.cookie('username', jsonResult.username, { expires: 30, path: '/' })
            $.cookie('fullname', jsonResult.fullname, { expires: 30, path: '/' })

            if (self.historyStep !== 0) {
              self.$router.go(self.historyStep)
            }
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
        // console.log("authCode:" + this.authCode)
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
              'fullname': v.fullname
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
              'fullname': v.fullname
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
