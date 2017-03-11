<template>
  <div id="register" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row">
      <div class="card col-12" style="padding-left: 0; padding-right: 0;">
        <div class="card-header text-center">
          充值
        </div>
        <div class="card-block">
          <div class="form-group has-success">
            <label class="form-control-label">金额</label>
            <input type="text" class="form-control" placeholder="充值金额，元"  v-model="total0">
            <div class="form-control-feedback">充值 {{total0}} 元</div>
            <small class="form-text text-muted">单位元, 保留小数点后2位</small>
          </div>
        </div>
        <div class="card-footer">
          <button type="button" class="btn  btn-success invisible" @click.stop="weixinPay0()">微信支付(测试)</button>
          <button type="button" class="btn  btn-success" @click.stop="weixinPay1()">微信支付</button>
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
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      total: null,
      total0: null,

      errMsg: '',
      errAlert: false,

      loading: false,
      loadingText: '数据加载中',

      appid: '',
      redirectUrl: '',
      orderId: ''
    }
  },
  watch: {
    total0 (curVal, oldVal) {
      console.log(curVal, oldVal)
      if (curVal === null) {
        this.total = null
      } else {
        this.total = parseInt(curVal * 100)
      }
    }
  },
  mounted: function () {
  },
  methods: {
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 2500)
    },
    waitForJump: function () {
      setTimeout(() => this.$router.push('/login'), 1500)
    },
    weixinPay0: function () {
      this.redirectUrl = DOMAIN_URL + '/wxp/test/wxp.html'
      this.createPayOrder()
    },
    weixinPay1: function () {
      this.redirectUrl = DOMAIN_URL + '/wxp/wxp.html'
      this.createPayOrder()
    },
    createPayOrder: function () {
      var self = this

      if (this.total === null || this.total < 1) {
        this.showErrMsg('请输入充值金额')
        return
      }

      this.loading = true
      this.loadingText = '支付准备中...'

      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/pay/createRechargeOrder',
        data: {
          'total_fee': self.total
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.orderId = jsonResult.desc
            self.weixinPay()
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function () {
          self.loading = false
        }
      })
    },
    weixinPay: function () {
      var self = this
      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/weixin/getAppid',
        dataType: 'text',
        success: function (jsonResult) {
          console.log(jsonResult)
          self.appid = jsonResult
          var url1 = self.redirectUrl
          var url0 = escape(url1)

          var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            self.appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + self.orderId + '#wechat_redirect'
          window.location.href = url
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function () {
          self.loading = false
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.')
    })
  }
}
</script>
