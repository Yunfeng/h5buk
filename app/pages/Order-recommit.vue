<template>  
	<div id="order-ticket" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>
    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>


    <div class="weui-cells__title text-center">重新提交</div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label for="" class="weui-label">票款总额</label>
        </div>
        <div class="weui-cell__bd">
          <input type="text" class="weui-input" placeholder="拒绝理由详细说明" v-model="ticketAmount" />
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">备注</label></div>
        <div class="weui-cell__bd">
          <input type="text" class="weui-input" placeholder="拒绝理由详细说明" v-model="remark" />
        </div>
      </div>    
      <div class="weui-cells__tips text-right">必填</div>
    </div>
    <div class="weui-btn-area">
      <button type="button" class="weui-btn weui-btn_primary" @click.stop="recommitOrder()">确定</button>
      <button type="button" class="weui-btn weui-btn_default" @click.stop="close()">取消</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: '数据加载中',

      ticketAmount: 0,
      remark: ''
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId }
  },
  mounted: function () {
    this.ticketAmount = this.info.ticketAmount
  },
  methods: {
    close: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    recommitOrder: function () {
      // 卖家：重新提交订单
      var url = '/Flight/orders/recommitTmcOrder.do'
      var postData = {
        'id': this.orderId,
        'ticketAmount': this.ticketAmount,
        'remark': this.remark
      }
      var successHandler = this.close

      this.executeOrderOp(url, postData, successHandler)
    },
    executeOrderOp: function (url, postData, successHandler) {
      var self = this

      self.loading = true
      self.loadingText = '处理中......'

      var opResult = false

      $.ajax({
        type: 'post',
        url: url,
        data: postData,
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.showErrMsg('操作成功')
            opResult = true
          } else {
            self.showErrMsg('操作失败： ' + jsonResult.errmsg)
          }
        },
        complete: function () {
          self.loading = false
          if (opResult) {
            successHandler()
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
