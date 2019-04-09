<template>  
	<div id="order-buyer" class="row">
    <div class="card col-12 px-0 border-0">
      <div class="card-header text-center">指定买家 通知付款</div>
        <div class="card-block px-0">
          <div class="form-group border-bottom-1">
            <input class="form-control border-0 bg-info text-white" type="text" placeholder="点击此处 指定买家" v-model="buyerName" @focus="buyerFocusedEvent()">
            <small id="fileHelp" class="form-text text-muted">{{buyerNameDesc}}</small>
          </div>
        </div>   
    </div>

    <div class='card col-12 border-0 mb-2'>
      <button type='button' class='btn btn-success w-100' @click.stop='ok()'>确定</button>
      <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='back()'>取消</button>
    </div>
    
    <my-customer-picker :show="showPicker" @close="pickerClosed"></my-customer-picker>
  </div>
</template>

<script>
import MyCustomerPicker from '../components/my-customer-picker.vue'
import { specifyBuyerForOrder } from '../api/order.js'

export default {
  components: {
    MyCustomerPicker
  },
  data () {
    return {
      buyerName: '',
      buyerType: -1,
      buyerUsername: '',
      buyerOpenid: '',

      showPicker: false
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId },
    buyerNameDesc () {
      if (this.buyerType === 0) {
        return '注册用户'
      } else if (this.buyerType === 1) {
        return '微信订阅用户'
      } else {
        return ''
      }
    }
  },
  mounted: function () {
    // this.search()
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
    ok: function () {
      if (this.buyerType === -1) {
        this.showErrMsg('请选择需要指定的客户', 'danger')
        return
      }

      if (this.buyerUsername === null && this.buyerOpenid === null) {
        this.showErrMsg('请选择需要指定的客户', 'danger')
        return
      }
      const params = {
        'type': this.buyerType,
        'username': this.buyerUsername,
        'openid': this.buyerOpenid
      }

      this.showLoading()
      specifyBuyerForOrder(this.orderId, params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功', 'success')
            this.back()
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        null,
        () => { this.hideLoading() }
      )
      // 卖家：拒单
      // var url = '/Flight/orders/denyTmcOrder.do'
      // var postData = {
      //   'id': this.orderId,
      //   'denyCode': this.denyCode,
      //   'denyReason': this.denyReason
      // }
      // var successHandler = this.close

      // this.executeOrderOp(url, postData, successHandler)
    },
    buyerFocusedEvent: function () {
      this.showPicker = true
    },
    pickerClosed: function (status, params) {
      this.showPicker = false
      // console.log(status)
      // console.log(params)
      if (status === 1) {
        this.buyerType = params.type
        this.buyerName = params.name

        if (this.buyerType === 0) {
          this.buyerUsername = params.username
        } else if (this.buyerType === 1) {
          this.buyerOpenid = params.openid
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
