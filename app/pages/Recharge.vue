<template>
  <div id="recharge" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click='back()' class="float-left">
        <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        <small>返回</small>
      </span>
      充值
    </div>
    <div class="card col-12 px-0">
      <div class="card-block">
        <div class="form-group has-success">
          <label class="form-control-label">金额</label>
          <input type="text" class="form-control" placeholder="充值金额，元"  v-model="total0">
          <div class="form-control-feedback">充值 {{total0}} 元</div>
          <small class="form-text text-muted">单位元, 保留小数点后2位</small>
        </div>
      </div>
      <div class="card-footer text-center">
        <button type="button" class="btn  btn-success btn-block" @click.stop="weixinPay1()">微信支付</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDomainUrl } from '../api/wx.js'
import $ from 'jquery'

export default {
  data () {
    return {
      total: null,
      total0: null,

      appid: '',
      redirectUrl: '',
      orderId: '',

      domain: ''
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
    this.getDomain()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    waitForJump: function () {
      setTimeout(() => this.$router.push('/login'), 1500)
    },
    weixinPay0: function () {
      this.redirectUrl = 'http://' + this.domain + '/wxp/test/wxp.html'
      this.createPayOrder()
    },
    weixinPay1: function () {
      this.redirectUrl = 'http://' + this.domain + '/wxp/wxp.html'
      this.createPayOrder()
    },
    createPayOrder: function () {
      var self = this

      if (this.total === null || this.total < 1) {
        this.showErrMsg('请输入充值金额')
        return
      }

      self.showLoading('支付准备中...')

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
          self.hideLoading()
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
          self.hideLoading()
        }
      })
    },
    getDomain: function () {
      getDomainUrl((val) => { this.domain = val })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.')
    })
  }
}
</script>
