<template>  
	<div id='order-ticket' class='container'>
    <div class='weui-toptips weui-toptips_warn' style='display:block' v-show='errAlert'>{{errMsg}}</div>
    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>
    
    <form id='frmFillTicketNo'>
    <div class='weui-cells__title text-center'>填写票号</div>
    <div class='weui-cells weui-cells_form'>
      
      <input type='hidden' name='tmcOrder.id' :value='info.id' />
      <template v-for='(psg, index) in info.passengers'>
        <input type='hidden' :name=''tmcOrder.passengers[' + index + '].id'' :value='psg.id' />
        <input type='hidden' :name=''tmcOrder.passengers[' + index + '].psgName'' :value='psg.psgName' />
        <div class='weui-cell'>
          <div class='weui-cell__hd'><label class='weui-label'>姓名</label></div>
          <div class='weui-cell__bd'>
            {{psg.psgName}}
          </div>
        </div>
        <div class='weui-cell'>
              <div class='weui-cell__hd'><label for='' class='weui-label'>票号</label></div>
              <div class='weui-cell__bd'>
                  <input class='weui-input' :name=''tmcOrder.passengers[' + index + '].ticketNo'' v-model='psg.ticketNo' placeholder='此处填写票号' />
              </div>
        </div>
        <div class='weui-cells__tips text-right'><strong>{{psg.ticketNo}}</strong></div>
        
      </template>
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
      errAlert: false,
      loading: false,
      loadingText: '数据加载中'
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail }
  },
  mounted: function () {
    // this.search();
  },
  methods: {
    close: function () {
      this.$router.push('/order/detail')
    },
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    saveTicketNoTmcOrder: function () {
      var self = this

      self.loading = true
      self.loadingText = '票号保存中......'

      var opResult = false

      $.ajax({
        type: 'post',
        url: '/Flight/orders/fillTicketNo.do',
        data: $('#frmFillTicketNo').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.showErrMsg('操作成功')
            opResult = true
          } else {
            self.showErrMsg('支付失败： ' + jsonResult.errmsg)
          }
        },
        complete: function () {
          self.loading = false
          if (opResult) {
            self.$store.commit('setOrderId', self.info.id)
            self.close()
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log('i m in.');
    })
  }
}
</script>
