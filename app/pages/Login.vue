<template>
  <div id="login" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row ">    
      <template v-if="logined === false">
        <div class="card col-12 mt-2 no-gutters" style="padding-left: 0; padding-right: 0;">
          <div class="card-header">
            登录
          </div>
          <div class="card-block no-gutters">
            <div class="form-group">
                <input class="form-control" type="text" placeholder="用户名" v-model="username">
            </div>
            <div class="form-group">
                <input class="form-control" type="password" placeholder="密码" v-model="password">
            </div>
            <my-vcode label-text="验证码" img-id="kaptchaImage" v-model="vcode"></my-vcode>
          </div>
          <div class="card-block text-center bg-faded text-white">
            <my-button @click="login()" type="success">登录</my-button>
          </div>
          <div class="card-block">
            <span><small><a href="#/password">找回密码</a></small></span>
            <span class="float-right"><small><a href="#/register">这里注册</a></small></span>
          </div>
        </div>
      </template>
      <template v-else-if="logined === true">
        <div class="card col-12 mt-2"  style="padding-left: 0; padding-right: 0;">
            <div class="media">
              <img class="d-flex mr-3" src="" alt="" style="width: 5rem; height: 5rem; ">
              <div class="media-body">
                <h5 class="mt-0">{{sessionUsername}}</h5>              
                当前用户
              </div>
            </div>
            <table class="table">
              <tr>
                <td class="text-right">现金账户</td>
                <td>{{userInfo.cashBalance}} <small>元</small></td>
                <td>充值</td>
              </tr>
              <tr>
                <td class="text-right">积分</td>
                <td>{{userInfo.freeBalance}}</td>
                <td></td>
              </tr>
            </table>
          <div class="card-block">
            <router-link to="/order" class="card-link">
              我的订单
            </router-link>
          </div>
          <div class="card-block bg-info">
            <router-link to="/home" class="card-link">
              更多功能
            </router-link>
          </div>

            <div class="card-footer text-right">
              <button class="btn btn-danger " @click="logout()">退出</button>
            </div>         
        </div>      
      </template>
    </div>

  </div>
</template>

<script>
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import MyVcodeInput from '../components/my-vcode.vue'
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
    logined () { return this.$store.state.logined },
    sessionUsername () { return this.$store.state.username },
    historyStep () { return this.$store.state.historyStep },
    userInfo () { return this.$store.state.userInfo }
  },
  mounted: function () {
    // console.log('mounted.');
    if (this.logined === false) {
      var username = $.cookie('username')
      var token = $.cookie('token')
      if (username !== undefined && token !== undefined) {
        console.log(username)
        console.log(token)
        this.$store.commit('setUsername', { 'username': username, 'logined': true })
      }
    }

    if (this.logined) {
      this.searchBalance()
    } else {
      this.refreshKaptcha()
    }
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
            self.$store.commit('setUsername', { 'username': jsonResult.username, 'logined': true })

            $.cookie('token', jsonResult.token, { expires: 30, path: '/' })
            $.cookie('username', jsonResult.username, { expires: 30, path: '/' })

            if (self.historyStep !== 0) {
              self.$router.go(self.historyStep)
            } else {
              self.$router.push('order')
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
    logout: function () {
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/login/logout',
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
    searchBalance: function () {
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/user/searchBalance',
        dataType: 'json',
        success: function (jsonResult) {
          // console.log(jsonResult);
          self.$store.commit('setUserInfo', jsonResult)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
      })
    },
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    refreshKaptcha: function () {
      $('#kaptchaImage').attr('src',
        '/Flight/captcha/getCaptchaCode.do?' + Math.floor(Math.random() * 100)).fadeIn()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.');
      $('#kaptchaImage').click(function () {
        $(this).hide().attr('src',
          '/Flight/captcha/getCaptchaCode.do?' + Math.floor(Math.random() * 100)).fadeIn()
      })

      $('#kaptchaImage').click()
    })
  }
}
</script>
