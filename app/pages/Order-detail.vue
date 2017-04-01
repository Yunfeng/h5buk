<template>
	<div id="order-detail" class="row">
    <template v-if="info !== null">
      <div class="col-12 bg-info text-center text-white fixed-top">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left"aria-hidden="true"></i>
        </span>
        <span class="fa-2">订单详情</span> <small>订单号:{{info.id}}</small>
      </div> 

      <div class="card col-12 px-0 border-0">
        <div class="card-header text-center">
          订单金额: <span class="text-danger"><i class="fa fa-rmb text-warning"></i> {{info.totalPrice}}</span>
        </div>
      </div>
      <div class="card col-12 px-0 border-0">
        <div class="card-block py-0 bg-primary text-white">
          <small>行程信息</small>
        </div>
        <template v-for='flt in info.flights'>
          <dl class='row'>
            <dt class='col-4 text-right px-0'>出发日期</dt>
            <dd class='col-8 text-info'>{{flt.departureDate}}</dd>
            <dt class='col-4 text-right px-0'>出发</dt>
            <dd class='col-8 text-info'>{{showTime(flt.departureTime)}} {{flt.departureAirportName}}</dd>

            <dt class='col-4 text-right px-0'>到达</dt>
            <dd class='col-8'>{{showTime(flt.arrivalTime)}} {{flt.arrivalAirportName}}</dd>

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
        <div class="card-block py-0 bg-primary text-white">
          <small>乘机人信息</small>
        </div>
        <template v-for='psg in info.passengers'>
          <dl class='row'>
            <dt class='col-4 text-right px-0'>姓名</dt>
            <dd class='col-8'>{{psg.psgName}}</dd>

            <dt class='col-4 text-right px-0'>证件号</dt>
            <dd class='col-8'>{{psg.idNo}}</dd>

            <dt class='col-4 text-right px-0'>证件类型</dt>
            <dd class='col-8'>{{showIdTypeDesc(psg.idType)}}</dd>
            <dt class='col-4 text-right px-0'>票号</dt>
            <dd class='col-8 text-success'>{{psg.ticketNo}}</dd>
          </dl>
        </template>

        <div class="card-block py-0 bg-faded">
          <small>结算信息</small>
        </div>
        <dl class="row">
          <dt class='col-4 text-right px-0'>原价</dt>
          <dd class='col-8'>
            <span><i class='fa fa-rmb'></i> {{info.totalPrice}}</span>
          </dd>
          <template v-if="info.status !== 1024">
            <template v-if="info.serviceFee > 0">
              <dt class='col-4 text-right px-0'>服务费</dt>
              <dd class='col-8'>
                <span class="text-danger"><i class='fa fa-rmb text-warning'></i> {{info.serviceFee}}</span>
              </dd>
            </template>
            <template v-if="info.policyId > 0">
              <dt class='col-4 text-right px-0'>返点</dt>
              <dd class='col-8'>
                <span>{{info.policyReturnPoint}}</span>
              </dd>
            </template>
            <dt class='col-4 text-right px-0'>开票价</dt>
            <dd class='col-8'>
              <span class="text-danger"><i class='fa fa-rmb text-warning'></i> {{info.ticketAmount}}</span>
            </dd>
            <dt class='col-4 text-right px-0'>节省</dt>
            <dd class='col-8 text-danger'>
              <span class="text-danger"><i class='fa fa-rmb text-warning'></i> {{costSaving}}</span>
            </dd>
          </template>
        </dl>

        <div class="card-block py-0 bg-faded">
          <small>其它</small>
        </div>
        <dl class='row'>
          <dt class='col-4 text-right px-0'>生成时间</dt>
          <dd class='col-8'>
            <p>{{convertLongToTimeDesc(info.createTime)}}</p>
          </dd>
          <dt class='col-4 text-right px-0'>订单状态</dt>
          <dd class='col-8'>
            <p>{{showStatusDesc(info.status)}}</p>
          </dd>
        </dl>
      </div>

      <template v-if='info.policyId >= 0'>
        <!-- 普通订单 -->
        <template v-if='info.status === 1024 && info.enterpriseId > 0'>
          <div class="card col-12 border-0 mb-2 px-0">
            <div class="card-block">
              <button type='button' class='btn btn-success w-100' @click.stop='commitTmcOrder(info.id)'>提交出票</button>
              <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='cancelTmcOrder(info.id)'>取消</button>
            </div>
          </div>
        </template>

        <template v-if='info.status === 1  && info.enterpriseId > 0'>          
          <div class='card col-12 border-0 mb-2'>
            <button type='button' class='btn btn-success w-100' @click.stop='payForTmcOrder(info.id)'>余额支付</button>

            <button type='button' class='btn btn-outline-success w-100 mt-3' @click.stop='weixinPay1(info.id)'>微信支付</button>

            <button type='button' class='btn btn-danger w-100 mt-3' @click.stop='cancelTmcOrder(info.id)'>取消</button>
          </div>
        </template>
        <template v-if='info.status === 4  && info.enterpriseId > 0'>
          <div class="card col-12 border-0 mb-2">
            <div class="card-block py-0 bg-faded">
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
          <div class='card col-12 border-0 mb-2'>
            <button type='button' class='btn btn-success w-100' @click.stop='toTicketTmcOrder(info.id);'>我来开票</button>
            <button type='button' class='btn btn-danger w-100 mt-3' @click.stop='denyTmcOrder(info.id);'>拒绝</button>
          </div>
        </template>
        <template v-if='info.status === 12  && info.enterpriseId === 0 && info.seller > 0'>
          <div class="card col-12 border-0 mb-2">
            <button type='button' class='btn btn-success w-100' @click='fillTicketNo(info.id);'>填写票号</button>
            <button type='button' class='btn btn-danger w-100 mt-3' @click='denyTmcOrder(info.id);'>拒绝</button>
          </div>
        </template>
      </template>
      <template v-else-if='info.policyId === -1 && info.status !== 128 && info.enterpriseId > 0'>      
        <div class='weui-cells__title'>
        候选政策
        </div>
        <table class='table table-striped table-condensive'>
          <thead>
              <tr>
                  <th>航司</th>
                  <th>舱位</th>
                  <th>返点</th>
                  <th>最低票面</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for='(info, index) in policies' @click='showPolicyDetail(info)'>
                  <td>{{info.carrier}}</td>
                  <td>{{info.subclass}}</td>
                  <td>{{info.returnPoint}}</td>
                  <td>{{info.minPrice}}</td>
                  <td><button class='btn btn-success btn-xs' @click.stop='selectPolicy(info)'>选择</button></td>
              </tr>
          </tbody>
        </table>
        <div class='weui-cells__title'>结算信息</div>
        <div class='weui-cells weui-cells_form'>
              <div class='weui-cell'>
                  <div class='weui-cell__hd'><label class='weui-label'>应付票款</label></div>
                  <div class='weui-cell__bd'>
                      <input class='weui-input' type='number' pattern='[0-9]*' v-model='ticketAmount' placeholder='请输入整数'>
                  </div>
              </div>
              <div class='weui-cells__tips'>用FD正价扣除返点，保留到元，不要分和角。含机场税，不含平台服务费。</div>
              <div class='weui-cell'>
                  <div class='weui-cell__hd'><label for='' class='weui-label'>备注</label></div>
                  <div class='weui-cell__bd'>
                      <input class='weui-input' value='' v-model='remark'>
                  </div>
              </div>
        </div>
        <div class='weui-form-preview'>
            <div class='weui-form-preview__bd'>
                <div class='weui-form-preview__item'>
                    <label class='weui-form-preview__label'>票款</label>
                    <span class='weui-form-preview__value'>{{ticketAmount}}</span>
                </div>
                <div class='weui-form-preview__item'>
                    <label class='weui-form-preview__label'>备注</label>
                    <span class='weui-form-preview__value'>{{remark}}</span>
                </div>
                <div class='weui-form-preview__item'>
                    <label class='weui-form-preview__label'>返点</label>
                    <span class='weui-form-preview__value'>{{returnPoint}}</span>
                </div>
                <div class='weui-form-preview__item'>
                    <label class='weui-form-preview__label'>返钱</label>
                    <span class='weui-form-preview__value'>{{returnMoney}}</span>
                </div>
            </div>
        </div>
        <div class='weui-btn-area'>
            <button class='weui-btn weui-btn_primary' @click='commitTmcPolicyOrder(info.id)'>提交出票</button>
            <button class='weui-btn weui-btn_warn' @click='cancelTmcOrder(info.id)'>取消</button>
          </div>
      </template>

    <!-- v-if info !=== null end -->
    </template> 

    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DOMAIN_URL, convertLongToTimeDesc, showIdTypeDesc, showOrderStatusDesc } from '../common/common.js'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import $ from 'jquery'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      loading: false,
      loadingText: '数据加载中',

      policies: [],

      ticketAmount: 0,
      remark: '',
      returnPoint: 0,
      returnMoney: 0,
      policyId: 0,
      ticketWrongConfirmTimes: 3,
      ticketCorrectConfirmTimes: 2
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId },
    psgCount () {
      if (this.$store.state.orderDetail == null) {
        return 0
      } else {
        return this.$store.state.orderDetail.passengers.length
      }
    },
    costSaving () {
      return this.info.totalPrice - this.info.ticketAmount - this.info.serviceFee
    }
  },
  mounted: function () {
    this.ticketWrongConfirmTimes = 3
    this.ticketCorrectConfirmTimes = 2

    var id = this.$route.params.id
    if (id !== undefined) {
      console.log(id)
      this.refreshOrderDetail(parseInt(id))
    } else {
      if (this.info !== null) {
        if (this.info.policyId === -1) {
          // search tmc policy
          this.searchPolicies()

          this.ticketAmount = this.info.totalPrice
        }
      } else if (this.orderId > 0) {
        this.refreshOrderDetail(this.orderId)
      }
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    calc: function () {
      var price = this.info.flights[0].price
      var psgCount = this.psgCount

      this.ticketAmount = Math.round((price * (100 - this.returnPoint) / 100 - this.returnMoney + 50) * psgCount)
    },
    searchPolicies: function () {
      var self = this

      self.loading = true
      self.loadingText = '政策查找中'

      var flightNo = self.info.flights[0].flightNo
      var subclass = self.info.flights[0].subclass
      var dport = self.info.flights[0].departureAirport

      var carrier = flightNo.substring(0, 2)

      $.ajax({
        type: 'post',
        url: '/Flight/policies/',
        data: {
          'sc.pageNo': 1,
          'sc.pageSzie': 5,
          'sc.policyType': -1,
          'sc.intlPolicy': -1,
          'sc.searchMode': 0,
          'sc.carrier': carrier,
          'sc.subClass': subclass,
          'sc.dport': dport
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            self.policies = jsonResult.dataList
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false

          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
        }
      })
    },
    selectPolicy: function (info) {
      this.returnPoint = info.returnPoint
      this.returnMoney = info.returnMoney
      this.policyId = info.id
      this.calc()
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
    convertLongToTimeDesc: function (l) {
      return convertLongToTimeDesc(l)
    },
    refreshOrderDetail: function (id) {
      if (id === undefined || id === null) {
        id = this.orderId
      }

      var self = this

      self.loading = true
      self.loadingText = '订单刷新中......'

      $.ajax({
        type: 'post',
        url: '/Flight/orders/searchOrderDetail',
        data: { id: id },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null && jsonResult.id === id) {
            self.$store.commit('setOrderDetail', jsonResult)
            self.searchPolicies()

            self.ticketAmount = self.info.totalPrice
          }
        },
        complete: function () {
          self.loading = false
        }
      })
    },
    cancelTmcOrder: function (id) {
      if (window.confirm('确定取消订单？') === false) {
        return
      }
      // 买家：取消订单
      var url = '/Flight/orders/cancelTmcOrder.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
    },
    commitTmcOrder: function (id) {
      // 买家
      var url = '/Flight/orders/commitTmcOrder.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
    },
    commitTmcPolicyOrder: function (id) {
      // 提交大客户政策订单开票
      var url = '/Flight/orders/commitTmcPolicyOrder.do'
      var postData = {
        'id': id,
        'policyId': this.policyId,
        'ticketAmount': this.ticketAmount,
        'remark': this.remark
      }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
    },
    payForTmcOrder: function (id) {
      // 买家：支付订单
      var url = '/Flight/orders/payForTmcOrder.do'
      var postData = { id: id }
      var successHandler = this.refreshOrderDetail

      this.executeOrderOp(url, postData, successHandler)
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
            self.showErrMsg('操作成功', 'success')
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
    },
    weixinPay1: function (orderId) {
      // alert('请咨询商家是否收取支付手续费!!!')
      this.createPayOrder(orderId)
    },
    createPayOrder: function (orderId) {
      var self = this

      this.loading = true
      this.loadingText = '支付准备中...'

      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/pay/createOrderPayOrder/' + orderId,
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            var appid = jsonResult.attach
            var payOrderId = jsonResult.desc

            var redirectUrl = DOMAIN_URL + '/wxp/wxp.html'
            var url0 = escape(redirectUrl)

            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + payOrderId + '#wechat_redirect'
            window.location.href = url
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
      // 通过 `vm` 访问组件实例
      window.scroll(0, 0)
    })
  }
}
</script>
