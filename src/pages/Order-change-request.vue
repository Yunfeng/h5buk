<template>  
	<div id="order-refund" class="row">
    <div class="col-12 bg-info text-center text-white sticky-top fa-2">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      <span class="fa-2">申请改期</span>
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
                改期内容
            </label>
            <div class="col-9">
                <input type="text" class="form-control" v-model="changeReason" />
                <p class="form-text text-muted small">改期内容：航班，日期，舱位等信息。</p>
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
        <button class="btn btn-success btn-block" @click="commitChangeApply()">申请改期</button>
      </div>
    </div>
  </div>
</template>

<script>
import { commitChangeRequest } from '../api/order.js'

export default {
  data () {
    return {
      changeReason: '',
      remark: ''
    }
  },
  computed: {
    info () { return this.$store.state.changeInfo }
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
    commitChangeApply: function () {
      if (this.changeReason.length === 0) {
        this.showErrMsg('改期内容是需要填写的', 'danger')
        return
      }

      this.showLoading('改期申请提交中......')

      var params = { 'orderId': this.info.orderId,
        'ticketNo': this.info.ticketNo,
        'psgName': this.info.psgName,
        'reason': this.changeReason,
        'remark': this.remark
      }

      // console.log(params)

      commitChangeRequest(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('改期申请已提交')
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
