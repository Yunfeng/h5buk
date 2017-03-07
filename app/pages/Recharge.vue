<template>
  <div id="register" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row">
      <div class="card col-12" style="padding-left: 0; padding-right: 0;">
        <div class="card-header text-center">
          充值
        </div>
        <div class="card-block">
          <form>
            <div class="form-group">
              <input type="input" class="form-control" placeholder="金额，单位：分"  v-model="total">
              <p class="form-text text-muted">
                金额
              </p>
            </div>
          </form>
        </div>
        <div class="card-footer">
          <button type="button" class="btn  btn-success" @click.stop="weixinPay0()">微信支付</button>
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
      total: 101,

      errMsg: '',
      errAlert: false,

      loading: false,
      loadingText: '数据加载中',

      appid: ''
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
      var self = this
      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/weixin/getAppid',
        dataType: 'text',
        success: function (jsonResult) {
          console.log(jsonResult)
          self.appid = jsonResult
          var url1 = 'http://b2c.90sky.com/wxp/test/wxp.html'
          // var url1 = 'http://172.168.1.101:9090/wxp/test/wxp.html'
          var url0 = escape(url1)
          console.log(url0)

          var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            self.appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + 'aaabbbccc' + '#wechat_redirect'
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
    },
    weixinPay: function () {
      // 除被扫支付场景以外，商户系统先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易回话标识后再按扫码、JSAPI、APP等不同场景生成交易串调起支付。
      var self = this

      self.loading = true
      self.loadingText = '保存中......'

      $.ajax({
        type: 'post',
        url: '/Flight/pay/generateWxPrepayOrder',
        data: {
          'id': 1,
          'openid': '123',
          'total_fee': self.total
        },
        dataType: 'json',
        success: function (jsonResult) {
          console.log(jsonResult)
          if (jsonResult !== null) {
            self.jsApiCall(jsonResult)
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
    jsApiCall: function (params) {
      WeixinJSBridge.invoke('getBrandWCPayRequest',
        {
          'appId': params.appid,     // 公众号名称，由商户传入
          'timeStamp': params.timeStamp,         // 时间戳，自1970年以来的秒数
          'nonceStr': params.nonceStr, // 随机串
          'package': params.packageA,
          'signType': params.signType,         // 微信签名方式
          'paySign': params.paySign // 微信签名
        },
        function (res) {
          console.log(res)
          if (res.err_msg === 'get_brand_wcpay_request：ok') {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
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
