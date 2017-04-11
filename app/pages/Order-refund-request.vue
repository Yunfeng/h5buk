<template>  
	<div id="order-refund" class="row">
    <div class="col-12 bg-info text-center text-white sticky-top fa-2">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      <span class="fa-2">申请退票</span>
    </div> 
    <div class="card card-outline-info col-12 border-0 px-0">
      <div class="card-block">
        <div class="form-group row">
            <label class="col-3 col-form-label text-right px-0">
                票号   
            </label>
            <div class="col-9">
                <input type="text" class="form-control" :value="info.ticketNo" readonly />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-3 col-form-label text-right px-0">
                乘客姓名    
            </label>
            <div class="col-9">
                <input type="text" class="form-control" :value="info.psgName" readonly />
            </div>
        </div>
        <div class="form-group row">
            <label class="col-3 col-form-label text-right px-0">
                退票原因
            </label>
            <div class="col-9">
                <input type="text" class="form-control" v-model="refundReason" />
                <p class="form-text text-muted small">退票理由：自愿，非自愿(具体原因)。</p>
            </div>
        </div>        
        <div class="form-group row">
            <label class="col-3 col-form-label text-right px-0">
                备注    
            </label>
            <div class="col-9">
                <input type="text" class="form-control" v-model="remark" />
            </div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-success btn-block" @click="commitRefundApply()">申请退票</button>
      </div>
    </div>
  </div>
</template>

<script>
import { commitRefundRequest } from '../api/order.js'

export default {
  data () {
    return {
      refundReason: '',
      remark: ''
    }
  },
  computed: {
    info () { return this.$store.state.refundInfo }
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
    commitRefundApply: function () {
      if (this.refundReason.length === 0) {
        this.showErrMsg('退票的理由需要填写的', 'danger')
        return
      }

      this.showLoading('提交退票中......')

      var params = { 'orderId': this.info.orderId,
        'ticketNo': this.info.ticketNo,
        'psgName': this.info.psgName,
        'reason': this.refundReason,
        'remark': this.remark
      }

      console.log(params)

      commitRefundRequest(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('退票申请已提交')
            // 跳转到退票单列表
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        (status, statuText) => { this.showErrMsg(status) },
        () => { this.hideLoading() }
      )
    }
  }
}
</script>
