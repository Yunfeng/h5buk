<template>
	<div id="order-detail" class="row">
    <template v-if="info !== null">
      <div class="col-12 bg-success text-center text-white sticky-top">
        <span @click="back()" class="float-left" v-if="logined">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        </span>
        <span class="fa-2">订单详情</span> <small>订单号:{{info.orderNo}}</small>
      </div> 

      <div class="card col-12 px-0 border-0">
        <div class="card-body py-0 bg-primary text-white">
          <small>行程信息</small>
        </div>        
        <template v-for='(flt, index) in info.flights'>
          <dl class='row mb-0' :key="index">
            <dt class='col-4 text-right px-0 font-weight-light mb-0'>
              <span class="d-inline-block text-success">航段 {{index+1}}.</span> 
              日期
            </dt>
            <dd class='col-8 text-danger mb-0'>{{flt.flight.departureDate}}</dd>
            <dt class='col-4 text-right px-0 font-weight-light mb-0'>出发</dt>
            <dd class='col-8 text-danger mb-0'>{{showTime(flt.flight.departureTime)}} {{flt.flight.departureAirportName}} <small>{{flt.flight.departureTerminal}}</small></dd>

            <dt class='col-4 text-right px-0 font-weight-light mb-0'>到达</dt>
            <dd class='col-8 mb-0'>{{showTime(flt.flight.arrivalTime)}} {{flt.flight.arrivalAirportName}} <small>{{flt.flight.arrivalTerminal}}</small></dd>

            <dt class='col-4 text-right px-0 font-weight-light mb-0'>航班</dt>
            <dd class='col-8 mb-0'>{{flt.flight.flightNo}}</dd>
            <dt class='col-4 text-right px-0 font-weight-light mb-0'>舱位</dt>
            <dd class='col-8 mb-0'>{{flt.flight.subclass}}</dd>
          </dl>
        </template>       
        <div class="card-body py-0 bg-primary text-white">
          <small>乘机人信息</small>
        </div>
        <template v-for='(psg, index) in info.passengers'>
          <dl class='row mb-0' :key="index">
            <dt class='col-4 text-right px-0 font-weight-light mb-0'>
              <span class="d-inline-block text-info">{{index+1}}.</span> 
              姓名
            </dt>
            <dd class='col-8 mb-0'>{{psg.name}}</dd>

            <dt class='col-4 text-right px-0 font-weight-light mb-0'>证件</dt>
            <dd class='col-8 mb-0'>{{showIdTypeDesc(psg.idType)}} {{psg.idNo}}</dd>

            <template v-if="psg.ticketNo">
              <dt class='col-4 text-right px-0 font-weight-light mb-0'>票号</dt>
              <dd class='col-8 mb-0'>
                {{psg.ticketNo}}
              </dd>
            </template>
          </dl>
        </template>

        <div class="card-body py-0 bg-primary text-white">
          <small>价格信息</small>
        </div>
        <dl class="row mb-0">
            <dt class='col-4 text-right px-0 font-weight-light'>应付金额</dt>
            <dd class='col-8'>
              <i class='fa fa-rmb text-warning'></i>
              <span class="text-danger fa-2"> {{info.amount}}</span>
            </dd>
        </dl>

        <div class="card-body py-0 bg-secondary">
          &nbsp;
        </div>
        <dl class='row'>
          <dt class='col-4 text-right px-0 font-weight-light'>订单时间</dt>
          <dd class='col-8'>
            <p>{{info.createTime}}</p>
          </dd>
          <dt class='col-4 text-right px-0 font-weight-light'>状态</dt>
          <dd class='col-8'>
            <p>{{showStatusDesc(info.orderStatus)}}</p>
          </dd>
        </dl>
      </div>
      <template v-if='info.status === 1024 && info.enterpriseId > 0'>
        <div class="card col-12 border-0 mb-2 px-0">
          <div class="card-body">
            <template v-if="info.totalPrice > 0 && info.ticketAmount > 0">
              <button type='button' class='btn btn-success w-100' @click.stop='commitTmcOrder(info.id)'>请求出票</button>  
            </template>
            <template v-else>
              <span class="text-info small float-right">请耐心等待工作人员核验价格</span>
            </template>
            
            <button type='button' class='btn btn-outline-danger w-100 mt-2' @click.stop='cancelTmcOrder(info.id)'>取消</button>
          </div>
        </div>
      </template>

      <template v-if='info.status === 1  && info.enterpriseId > 0'>          
        <div class='card col-12 border-0 mb-5'>
          <button type='button' class='btn btn-success w-100' @click.stop='payForTmcOrder(info.id)'>支付</button>
        </div>
      </template>
      <template v-if='info.status === 4  && info.enterpriseId > 0'>
        <div class="card col-12 border-0 mb-2">
          <div class="card-body py-0 bg-faded">
            <small>拒单说明</small>
          </div>
          <dl class='row'>
            <dt class='col-4 text-right  px-0'>拒单理由</dt>
            <dd class='col-8'>
              <p>{{info.denyReason}} <small>({{info.denyCode}})</small></p>
            </dd>
          </dl>
        </div>
        <template v-if='info.denyCode == 401 || info.denyCode == 402'>
          <div class='card col-12 border-0 mb-2'>
            <button type='button' class='btn btn-success w-100' @click='recommitTmcOrder()'>重新提交</button>
          </div>
        </template>
      </template>
      <template v-if='info.status === 16  && info.enterpriseId > 0 && info.policyId > 0'>
        <div class='card col-12 border-0 mb-2'>
          <button type='button' class='weui-btn weui-btn_primary' @click='confirmOrderTicketRight(info.id)'>票号正确</button>

          <button type='button' class='weui-btn weui-btn_warn' @click='confirmOrderTicketWrong(info.id)'>票号有误</button>
        </div>
      </template>
      <template v-if='info.status === 8  && info.enterpriseId === 0 && info.seller > 0'>          
        <div class='card col-12 border-0 mb-4'>
          <button type='button' class='btn btn-success w-100' @click.stop='toTicketTmcOrder(info.id);'>我来开票</button>
          <button type='button' class='btn btn-danger w-100 mt-3' @click.stop='denyTmcOrder(info.id);'>拒绝</button>
        </div>
      </template>
      <template v-if='info.status === 12  && info.enterpriseId === 0 && info.seller > 0'>
        <div class="card col-12 border-0 mb-4">
          <button type='button' class='btn btn-success w-100' @click='fillTicketNo(info.id);'>填写票号</button>
          <button type='button' class='btn btn-danger w-100 mt-3' @click='denyTmcOrder(info.id);'>拒绝</button>
        </div>
      </template>
    </template> 

    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>
  </div>
</template>

<script>
import MyModalPrompt from '../components/my-modal-prompt.vue'
import { showIdTypeDesc,  } from '../common/common.js'
import { getDomainUrl } from '../api/wx.js'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import $ from 'jquery'
import { searchOrderDetail, cancelOrder, processOrder } from '../api/order.js'
import { payForTmcOrder, showOrderStatusDesc, confirmTicketNoWrong, confirmTicketNoCorrect } from '../api/order.js'
import { createFlightPaymentOrder } from '../api/order.js'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput,
    MyModalPrompt
  },
  data () {
    return {
      remark: '',
      domain: '',

      modalTitle: ''
    }
  },
  computed: {
    logined () { return this.$store.state.logined },
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId }
  },
  mounted: function () {
    this.ticketWrongConfirmTimes = 3
    this.ticketCorrectConfirmTimes = 2

    var id = this.$route.params.id
    if (id !== undefined) {
      this.refreshOrderDetail(parseInt(id), this.$route.query.auth_code)
    } else {
      if (this.orderId > 0) {
        this.refreshOrderDetail(this.orderId)
      }
    }

    console.log()

    // this.getDomain()
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
    showStatusDesc: function (status) {
      return showOrderStatusDesc(status)
    },
    showIdTypeDesc: function (idType) {
      return showIdTypeDesc(idType)
    },
    showTime: function (old) {
      if (old.length === 4) {
        return old.substring(0, 2) + ':' + old.substring(2, 4)
      } else {
        return old
      }
    },
    refreshOrderDetail: function (id, authCode) {
      if (id === undefined || id === null) {
        id = this.orderId
      }

      this.showLoading('订单查询中...')

      const params = {
        'code': authCode
      }

      searchOrderDetail(id, params, v => {
          if (v.errCode === 0) {
            this.$store.commit('setOrderDetail', v)
          } else {
            this.showErrMsg(v.errMsg, 'danger') 
          }
        },
        () => this.hideLoading(),
        (status, statusText) => { 
          console.log(status)
          this.showErrMsg(status + ', ' + statusText, 'danger') 
        }      
      )
    },
    cancelTmcOrder: function (id) {
      this.modalTitle = '确定取消订单吗？'
      this.$refs.modalPrompt.modal('YesOrNo').then(() => {
        // 买家：取消订单
        const params = { 'id': id }

        cancelOrder(params, v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功', 'success')
              this.refreshOrderDetail()
            } else {
              this.showErrMsg(v.errmsg)
            }
          }, null,
          () => this.hideLoading()
        )
      }).catch((ex) => {})
    },
    commitTmcOrder: function (id) {
      // 买家
      if (this.info.policyId > 0) {
        // 提交大客户政策订单开票
        const url = '/Flight/orders/commitTmcPolicyOrder.do'
        const postData = {
          'id': id,
          'policyId': this.info.policyId,
          'ticketAmount': this.info.ticketAmount,
          'remark': this.remark
        }
        const successHandler = this.refreshOrderDetail

        this.executeOrderOp(url, postData, successHandler)
      } else {
        const url = '/Flight/orders/commitTmcOrder.do'
        const postData = { id: id }
        const successHandler = this.refreshOrderDetail

        this.executeOrderOp(url, postData, successHandler)
      }
    },
    payForTmcOrder: function (id) {
      // 买家：支付订单
      payForTmcOrder({ id }, v => {
        console.log(v)
        if (v.status === 'OK') {
          this.showErrMsg('支付成功')
          this.refreshOrderDetail()
        } else if (v.errcode === -4) {
          // 调用微信支付
          this.showErrMsg(v.errmsg + ', 使用微信支付', 'danger')
          this.weixinPay1(id)
        } else {
          this.showErrMsg(v.errmsg, 'danger')
        }
      })
    },
    toTicketTmcOrder: function (id) {
      // 卖家：我来开票
      var url = '/Flight/orders/toTicketForTmcOrder.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
    },
    denyTmcOrder: function (id) {
      this.$router.push('/order/deny')
    },
    recommitTmcOrder: function () {
      this.$router.push('/order/recommit')
    },
    fillTicketNo: function (id) {
      this.$router.push('/order/ticket')
    },
    confirmOrderTicketWrong: function (id) {
      this.modalTitle = '确定票号有错误吗？'
      this.$refs.modalPrompt.modal('YesOrNo').then(() => {
        const params = { 'id': id }

        confirmTicketNoWrong(params, v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功', 'success')
              this.refreshOrderDetail()
            } else {
              this.showErrMsg(v.errmsg)
            }
          }
        )
      }).catch((ex) => {})      
    },
    confirmOrderTicketRight: function (id) {
      // 买家：票号正确
      this.modalTitle = '已确认票号正确了吗？'
      this.$refs.modalPrompt.modal('YesOrNo').then(() => {
        const params = { 'id': id }

        confirmTicketNoCorrect(params, v => {
            if (v.status === 'OK') {
              this.showErrMsg('操作成功', 'success')
              this.refreshOrderDetail()
            } else {
              this.showErrMsg(v.errmsg)
            }
          }
        )
      }).catch((ex) => {})      
    },
    executeOrderOp: function (url, postData, successHandler) {
      this.showLoading('处理中......')

      let opResult = false

      processOrder(url, postData,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功', 'success')
            opResult = true
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        null,
        () => {
          this.hideLoading()
          if (opResult) {
            successHandler()
          }
        }
      )
    },
    weixinPay1: function (orderId) {
      this.createPayOrder(orderId, 0)
    },
    aliPay1: function (orderId) {
      this.createPayOrder(orderId, 1)
    },
    createPayOrder: function (orderId, payType) {
      var self = this

      this.showLoading('支付准备中...')

      const params = {
        'workMode': this.workMode
      }

      createFlightPaymentOrder(orderId, payType, params, v => {
          if (v.status === 'OK') {
            if (payType === 0) {
              const appid = v.attach
              const payOrderId = v.desc

              let redirectUrl
              if (this.workMode === 8) {
                redirectUrl = 'http://' + self.domain + '/wxp/wxp-corp.html'
              } else {
                redirectUrl = 'http://' + self.domain + '/wxp/wxp.html'
              }

              
              const url0 = escape(redirectUrl)

              const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + payOrderId + '#wechat_redirect'
              window.location.href = url
            } else if (payType === 1) {
              const url = v.attach
              window.location.href = url
            }
          } else {
            this.showLoading(v.errmsg)
          }
        },
        () => { this.hideLoading() }
      )
    },
    applyRefund: function (ticketNo, psgName, orderId) {
      // 申请退票
      this.$store.commit('setRefundInfo', { 'ticketNo': ticketNo, 'psgName': psgName, 'orderId': orderId })
      this.$router.push('/refund/apply')
    },
    applyChange: function (ticketNo, psgName, orderId) {
      // 申请改期
      this.$store.commit('setChangeInfo', { 'ticketNo': ticketNo, 'psgName': psgName, 'orderId': orderId })
      this.$router.push('/change/apply')
    },
    specifyBuyerPayOrder: function (id) {
      // 指定买家并通知买家付款
      this.$router.push('/order/' + id + '/buyer')
    },
    getDomain: function () {
      getDomainUrl((val) => { this.domain = val })
    }
  }
}
</script>
