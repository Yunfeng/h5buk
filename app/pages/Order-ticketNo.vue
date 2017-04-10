<template>  
	<div id='order-ticket' class='row'>
    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>
    
    <form id='frmFillTicketNo' class="col-12 px-0">
      <input type='hidden' name='tmcOrder.id' :value='info.id' />
    
      <div class="card card-outline-info col-12 border-0 px-0">
        <div class="card-header text-center">
          填写票号
        </div>
        <div class="card-block" v-for="(psg, index) in info.passengers">
          <input type='hidden' :name="'tmcOrder.passengers[' + index + '].id'" :value='psg.id' />
          <input type='hidden' :name="'tmcOrder.passengers[' + index + '].psgName'" :value='psg.psgName' />

          <div class="form-group" >
            <label class="form-control-label"><span class="text-info small">乘客:</span> {{psg.psgName}}</label>
            <input class='form-control' :name="'tmcOrder.passengers[' + index + '].ticketNo'" v-model='psg.ticketNo' placeholder='填写票号' />
              <div class="form-control-feedback"><strong>{{psg.ticketNo}}</strong></div>
              <small class="form-text text-muted">请准确填写票号</small>
          </div>

          

        </div>

      </div>
      
      
      

      <div class='weui-btn-area'>
        <button type='button' class='weui-btn weui-btn_primary' @click.stop='saveTicketNoTmcOrder()'>保存票号</button>
        <button type='button' class='weui-btn weui-btn_default' @click.stop='close()'>取消</button>
      </div>
    </form>
    

                
    
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'

import $ from 'jquery'

export default {
  components: {
    'my-pagination': MyPagination,
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      loading: false,
      loadingText: '数据加载中'
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail }
  },
  methods: {
    close: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    saveTicketNoTmcOrder: function () {
      var self = this

      self.loading = true
      self.loadingText = '票号保存中......'

      var opResult = false

      console.log($('#frmFillTicketNo').serialize())

      $.ajax({
        type: 'post',
        url: '/Flight/orders/fillTicketNo.do',
        data: $('#frmFillTicketNo').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.showErrMsg('操作成功', 'success')
            opResult = true
          } else {
            self.showErrMsg('支付失败： ' + jsonResult.errmsg)
          }
        },
        complete: function () {
          self.loading = false
          if (opResult) {
            // self.$store.commit('setOrderId', self.info.id)
            self.close()
          }
        }
      })
    }
  }
}
</script>
