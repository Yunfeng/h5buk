<template>
  <div id="register" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row">
      <div class="card col-12 border-0" style="padding-left: 0; padding-right: 0;">
        <div class="card-header text-center">
          充值结果
        </div>
        <template v-if="detail">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">流水号：{{detail.trade_no}}</li>
            <li class="list-group-item">金额: {{detail.priceFen / 100}} 元</li>
          </ul>
          <div class="card-block b-0">
            <h4 class="card-title text-success text-center" v-if="detail.status == 9">充值成功</h4>
            <p class="card-title text-danger text-center" v-if="detail.status != 9">充值中...</p>
          </div>
        </template>
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
      errMsg: '',
      errAlert: false,

      loading: false,
      loadingText: '数据加载中',

      orderId: '',
      detail: null
    }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined) {
      this.orderId = id
      this.searchPayOrder()
    }
  },
  methods: {
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 2500)
    },
    jumpTo: function (id) {
      var uri = '/order/' + id
      this.$router.replace(uri)
    },
    searchPayOrder: function () {
      var self = this

      self.loading = true

      $.ajax({
        type: 'post',
        url: '/Flight/pay/order/' + this.orderId,
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            self.detail = jsonResult

            if (jsonResult.orderType === '01') {
              // 机票订单
              self.showErrMsg('稍等，我们帮您转到订单详情页面')
              setTimeout(() => { self.jumpTo(jsonResult.orderId) }, 2500)
            }
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
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.')
    })
  }
}
</script>
