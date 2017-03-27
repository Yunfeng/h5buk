<template>  
	<div id="order-recommit" class="row">
    <div class="card col-12 border-0 px-0">
      <div class="card-header text-center">重新提交</div>
      <div class="card-block">
        <div class="form-group row">
          <label class="col-4 col-form-label text-right">票款总额</label>
          <div class="col-8">
            <input type="text" class="form-control" placeholder="" v-model="ticketAmount" />
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">备注</label>
          <div class="col-8">
            <input type="text" class="form-control" placeholder="" v-model="remark" />
            <span class="form-text text-muted">
              <small>必填</small>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class='card col-12 border-0 mb-2'>
      <button type='button' class='btn btn-success w-100' @click.stop='recommitOrder()'>确定</button>
      <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='close()'>取消</button>
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
      console.log(msg)
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg })
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
            self.showErrMsg(jsonResult.errmsg)
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
  }
}
</script>
