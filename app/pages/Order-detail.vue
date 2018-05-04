<template>
	<div id="order-detail" class="row">
    <template v-if="info !== null">
      <div class="col-12 bg-info text-center text-white sticky-top">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left"aria-hidden="true"></i>
          <small>返回</small>
        </span>
        <span class="fa-2">订单详情</span> <small>订单号:{{info.id}}</small>
      </div> 

      <div class="card col-12 px-0 border-0">
        <div class="card-body text-center">
          订单金额: <span class="text-danger"><i class="fa fa-rmb text-warning"></i> {{info.totalPrice}}</span>
        </div>
      </div>
      <div class="card col-12 px-0 border-0">
        <div class="card-body py-0 bg-info text-warning">
          <small>行程信息</small>
        </div>
        <template v-for='(flt, index) in info.flights'>
          <dl class='row mb-0'>
            <dt class='col-4 text-right px-0'>
              <span class="d-inline-block text-info">{{index+1}}.</span> 
              出发日期
            </dt>
            <dd class='col-8 text-info'>{{flt.departureDate}}</dd>
            <dt class='col-4 text-right px-0'>出发</dt>
            <dd class='col-8 text-info'>{{showTime(flt.departureTime)}} {{flt.departureAirportName}} <small>{{flt.departureTerminal}}</small></dd>

            <dt class='col-4 text-right px-0'>到达</dt>
            <dd class='col-8'>{{showTime(flt.arrivalTime)}} {{flt.arrivalAirportName}} <small>{{flt.arrivalTerminal}}</small></dd>

            <dt class='col-4 text-right px-0'>航班</dt>
            <dd class='col-8 text-info'>{{flt.flightNo}}</dd>
            <dt class='col-4 text-right px-0'>舱位</dt>
            <dd class='col-8'>{{flt.subclass}}</dd>
            <dt class='col-4 text-right px-0'>价格</dt>
            <dd class='col-8'>{{flt.price}}</dd>
            <dt class='col-4 text-right px-0'>机场税</dt>
            <dd class='col-8'>{{flt.taxCn}}</dd>
          </dl>
        </template>       
        <div class="card-body py-0 bg-info text-warning">
          <small>乘机人信息</small>
        </div>
        <template v-for='(psg, index) in info.passengers'>
          <dl class='row mb-0'>
            <dt class='col-4 text-right px-0'>
              <span class="d-inline-block text-info">{{index+1}}.</span> 
              姓名
            </dt>
            <dd class='col-8'>{{psg.psgName}}</dd>

            <dt class='col-4 text-right px-0'>证件</dt>
            <dd class='col-8'>{{showIdTypeDesc(psg.idType)}} {{psg.idNo}}</dd>

            <template v-if="psg.ticketNo">
              <dt class='col-4 text-right px-0'>票号</dt>
              <dd class='col-8 text-success'>
                {{psg.ticketNo}}
                <div class="float-right mr-2">
                  <span class="text-warning small" @click.stop="applyChange(psg.ticketNo, psg.psgName, info.id)">改签</span>
                  <span class="text-danger small" @click.stop="applyRefund(psg.ticketNo, psg.psgName, info.id)">退票</span>
                </div>
              </dd>
            </template>
          </dl>
        </template>

        <template v-if="info.insurances.length > 0">
          <div class="card-body py-0 bg-info text-warning">
            <small>保险</small>
          </div>
          <dl class='row mb-0' v-for='(info, index) in info.insurances'>
            <dt class='col-4 text-right px-0'>              
            </dt>
            <dd class='col-8'>{{info.productName}}</dd>

            <dt class='col-4 text-right px-0'>价格</dt>
            <dd class='col-8'><i class='fa fa-rmb text-warning'></i>{{info.price - info.discount}}/份</dd>

            <dt class='col-4 text-right px-0'>份数</dt>
            <dd class='col-8'>{{info.count}}</dd>

            
          </dl>
        </template>

        <div class="card-body py-0 bg-info text-warning">
          <small>结算信息</small>
        </div>
        <dl class="row mb-0">
          <dt class='col-4 text-right px-0'>总价</dt>
          <dd class='col-8'>
            <i class="fa fa-rmb text-warning"></i><span class="text-info fa-2"> {{info.totalPrice}}</span>
          </dd>
          <template v-if="info.status !== 1025">
            <template v-if="info.policyId > 0">
              <dt class='col-4 text-right px-0'>返点</dt>
              <dd class='col-8'>
                <span>{{info.policyReturnPoint}}</span>
              </dd>
            </template>
            <template v-if="info.ticketAmount > 0">
              <dt class='col-4 text-right px-0'>应付票款</dt>
              <dd class='col-8'>
                <i class='fa fa-rmb text-warning'></i>
                <span class="text-danger fa-2"> {{info.ticketAmount}}</span>
              </dd>
            </template>
            <template v-if="info.serviceFee > 0">
              <dt class='col-4 text-right px-0'>服务费</dt>
              <dd class='col-8'>
                <span class="text-danger"><i class='fa fa-rmb text-warning'></i> {{info.serviceFee}}</span>
              </dd>
            </template>
            <template v-if="info.ticketAmount > 0 && costSaving > 0">
              <dt class='col-4 text-right px-0'>节省</dt>
              <dd class='col-8 text-danger'>
                <span class="text-danger"><i class='fa fa-rmb text-warning'></i> {{costSaving}}</span>
              </dd>
            </template>
          </template>
        </dl>

        <div class="card-body py-0 bg-info">
          <small>其它</small>
        </div>
        <dl class='row'>
          <dt class='col-4 text-right px-0'>时间</dt>
          <dd class='col-8'>
            <p>{{info.createTime}}</p>
          </dd>
          <dt class='col-4 text-right px-0'>状态</dt>
          <dd class='col-8'>
            <p>{{showStatusDesc(info.status)}}</p>
          </dd>
        </dl>
      </div>

      <template v-if='info.status === 1024 && info.enterpriseId > 0'>
        <template v-if="policies.length > 0">
          <div class="card-body py-0 bg-faded text-info">
            特殊政策 <small>(票面低于实际付款金额)</small>
          </div>
          <table class='table table-sm table-striped table-condensive'>
            <thead>
                <tr>
                    <th>航司</th>
                    <th>舱位</th>
                    <th class="text-right">返点</th>
                    <th class="text-right">最低票面</th>
                    <th></th>
                </tr>                        
            </thead>
            <tbody>
                <tr v-for='(info, index) in policies' @click='showPolicyDetail(info)'>
                    <td>{{info.carrier}}</td>
                    <td>{{info.subclass}}</td>
                    <td class="text-right">{{info.returnPoint}}</td>
                    <td class="text-right">{{info.minPrice}}</td>
                    <td class="text-center"><button class='btn btn-success btn-sm' @click.stop='selectPolicy(info)'>选择</button></td>
                </tr>
            </tbody>
          </table>
          <div class="card-body py-0 bg-faded text-info">
            <small>备注</small>
          </div>
          <table class="table">
            <tr>
              <td>
                <input type="input" class="form-control" placeholder="请在此输入备注信息" v-model="remark">
              </td>
            </tr>                  
          </table>                
        </template>

        <div class="card col-12 border-0 mb-2 px-0">
          <div class="card-body">
            <template v-if="info.enterpriseId === info.seller && info.totalPrice !== null && info.totalPrice > 0">              
              <button type='button' class='btn btn-outline-danger w-100 mb-3' @click.stop='specifyBuyerPayOrder(info.id)'>通知买家付款</button>
            </template>

            <template v-if="info.totalPrice !== null && info.totalPrice > 0">
              <button type='button' class='btn btn-success w-100' @click.stop='commitTmcOrder(info.id)'>申请出票</button>  
            </template>
            

            <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='cancelTmcOrder(info.id)'>取消</button>
          </div>
        </div>
      </template>

      <template v-if='info.status === 1  && info.enterpriseId > 0'>          
        <div class='card col-12 border-0 mb-5'>
          <button type='button' class='btn btn-success w-100' @click.stop='payForTmcOrder(info.id)'>支付</button>
          <button type='button' class='btn btn-outline-success w-100 invisible' @click.stop='weixinPay1(info.id)'>
            微信支付
            <template v-if="wxpayRate>0">
              <small>支付费率千分之 {{wxpayRate}}</small>
            </template>
          </button>
          <button type='button' class='btn btn-outline-info w-100 invisible' @click.stop="aliPay1(info.id)">
            支付宝
            <template v-if="alipayRate>0">
              <span class="small align-bottom">支付费率千分之 {{alipayRate}}</span>
            </template>
          </button>
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
          <button type='button' class='weui-btn weui-btn_primary' @click='confirmOrderTicketRight(info.id)'>票号正确 ({{ticketCorrectConfirmTimes}})</button>

          <button type='button' class='weui-btn weui-btn_warn' @click='confirmOrderTicketWrong(info.id)'>票号有误 ({{ticketWrongConfirmTimes}})</button>
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
  </div>
</template>

<script>
import { showIdTypeDesc,  } from '../common/common.js'
import { getDomainUrl } from '../api/wx.js'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import $ from 'jquery'
import { searchPolicies, searchOrderDetail, cancelOrder, searchPayRates, processOrder } from '../api/order.js'
import { payForTmcOrder, showOrderStatusDesc } from '../api/order.js'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      policies: [],
      remark: '',
      wxpayRate: 0,
      alipayRate: 0,
      domain: ''
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId },
    costSaving () {
      return this.info.totalPrice - this.info.ticketAmount - this.info.serviceFee
    }
  },
  mounted: function () {
    this.ticketWrongConfirmTimes = 3
    this.ticketCorrectConfirmTimes = 2

    var id = this.$route.params.id
    if (id !== undefined) {
      this.refreshOrderDetail(parseInt(id))
    } else {
      if (this.orderId > 0) {
        this.refreshOrderDetail(this.orderId)
      }
    }

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
    searchPolicies: function () {
      var self = this

      self.showLoading('查找政策...')

      var flightNo = self.info.flights[0].flightNo
      var subclass = self.info.flights[0].subclass
      var dport = self.info.flights[0].departureAirport
      var carrier = flightNo.substring(0, 2)

      var params = { 'sc.pageNo': 1,
        'sc.pageSzie': 5,
        'sc.policyType': -1,
        'sc.intlPolicy': -1,
        'sc.searchMode': 0,
        'sc.carrier': carrier,
        'sc.subClass': subclass,
        'sc.dport': dport
      }

      searchPolicies(params,
        (jsonResult) => {
          if (jsonResult !== null) {
            self.policies = jsonResult.dataList
          }
        },
        (status, statusText) => {
          if (status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        () => self.hideLoading()
      )
    },
    selectPolicy: function (info0) {
      this.$store.commit('selectPolicy', { 'policyId': info0.id,
        'returnPoint': info0.returnPoint,
        'returnMoney': info0.returnMoney }
      )
      this.showErrMsg('选择成功', 'success')
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
    showPolicyDetail: function (info) {
      this.$store.commit('setPolicyDetail', info)
      this.$router.push('/tmc/detail')
    },
    refreshOrderDetail: function (id) {
      if (id === undefined || id === null) {
        id = this.orderId
      }

      this.showLoading('订单查询中...')

      var params = { 'id': id }

      searchOrderDetail(params,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.$store.commit('setOrderDetail', jsonResult)

            if (jsonResult.status === 1024) {
              // this.searchPolicies()
            } else if (jsonResult.status === 1) {
              // 查找支付费率
              this.searchPayRate()
            }
          }
        },
        (status, statusText) => { this.showErrMsg(status + ', ' + statusText, 'danger') },
        () => this.hideLoading()
      )
    },
    cancelTmcOrder: function (id) {
      if (window.confirm('确定取消订单？') === false) {
        return
      }
      // 买家：取消订单
      this.showLoading('取消中...')
      var params = { 'id': id }

      cancelOrder(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功', 'success')
            this.refreshOrderDetail()
          } else {
            this.showErrMsg(jsonResult.errmsg)
          }
        },
        null,
        () => this.hideLoading()
      )
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
      // var url = '/Flight/orders/payForTmcOrder.do'
      // var postData = { id: id }
      // var successHandler = this.refreshOrderDetail

      // this.executeOrderOp(url, postData, successHandler)
      payForTmcOrder({ id }, v => {
        console.log(v)
        if (v.status === 'OK') {
          this.showErrMsg('支付成功')
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
      this.ticketWrongConfirmTimes--
      if (this.ticketWrongConfirmTimes > 0) {
        console.log(this.ticketWrongConfirmTimes)
        return
      }

      // 买家：票号错误
      var url = '/Flight/orders/confirmOrderTicketWrong.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
    },
    confirmOrderTicketRight: function (id) {
      this.ticketCorrectConfirmTimes--
      if (this.ticketCorrectConfirmTimes > 0) {
        console.log(this.ticketCorrectConfirmTimes)
        return
      }

      // 买家：票号正确
      var url = '/Flight/orders/confirmOrderTicketCorrect.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
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

      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/pay/createPayOrder/01/' + orderId + '/' + payType,
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            if (payType === 0) {
              var appid = jsonResult.attach
              var payOrderId = jsonResult.desc

              var redirectUrl = 'http://' + self.domain + '/wxp/wxp.html'
              var url0 = escape(redirectUrl)

              const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + payOrderId + '#wechat_redirect'
              window.location.href = url
            } else if (payType === 1) {
              const url = jsonResult.attach
              window.location.href = url
            }
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
    searchPayRate: function () {
      searchPayRates((jsonResult) => {
        // console.log(jsonResult)
        this.wxpayRate = jsonResult.wxpayRate
        this.alipayRate = jsonResult.alipayRate
      })
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
