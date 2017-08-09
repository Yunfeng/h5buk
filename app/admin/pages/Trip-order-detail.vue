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
        <div class="card-block text-center" @click="showTripDetail(info.tripId)">
          <span class="text-primary">{{info.tripName}}</span> <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
          <br/>      
          <span class="small">出发日期：</span><span class="text-danger small">{{info.ddate}}</span>
        </div>
      </div>
      <div class="card col-12 px-0 border-0">
        <div class="card-block py-0 bg-faded text-warning">
          <small>游客信息</small>
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
          </dl>
        </template>

        <div class="card-block py-0 bg-faded text-warning">
          <small>结算信息</small>
        </div>
        <dl class="row mb-0">
          <dt class='col-4 text-right px-0'>总价</dt>
          <dd class='col-8'>
            <i class="fa fa-rmb text-warning"></i><span class="text-info fa-2"> {{info.totalPrice}}</span>
          </dd>
        </dl>

        <div class="card-block py-0 bg-faded">
          <small>其它</small>
        </div>
        <dl class='row'>
          <dt class='col-4 text-right px-0'>下单时间</dt>
          <dd class='col-8'>
            <p>{{formatDateTime(info.createTime)}}</p>
          </dd>
          <dt class='col-4 text-right px-0'>订单状态</dt>
          <dd class='col-8'>
            <p>{{showStatusDesc(info.status)}}</p>
          </dd>
        </dl>
      </div>

      <template v-if='info.status === 0'>          
        <div class='card col-12 border-0 mb-5'>
          <button type='button' class='btn btn-success w-100' @click.stop='acceptTripOrder(info.id)'>可以参团</button>
          <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='denyTripOrder(info.id, 1001, "团位已满")'>
            团位已满，不能参团
          </button>
        </div>
      </template>
      <template v-if='info.status === 4'>
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
      </template>
    </template> 
  </div>
</template>

<script>
import { convertLongToTimeDesc, showIdTypeDesc, showTripOrderStatus } from '../../common/common.js'
import MyButton from '../../components/my-button.vue'
import MyInput from '../../components/my-input.vue'
import { searchTripOrderDetail, acceptTripOrder, denyTripOrder } from '../../api/order.js'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      info: null,
      policies: [],
      remark: ''
    }
  },
  mounted: function () {
    const id = this.$route.params.id
    // console.log(id)
    this.refreshOrderDetail(parseInt(id))
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
      return showTripOrderStatus(status)
    },
    showIdTypeDesc: function (idType) {
      return showIdTypeDesc(idType)
    },
    formatDateTime: function (l) {
      return convertLongToTimeDesc(l)
    },
    refreshOrderDetail: function (id) {
      if (id === undefined || id === null) {
        id = this.orderId
      }

      this.showLoading('订单查询中...')

      searchTripOrderDetail(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.info = jsonResult
          }
        },
        (status, statusText) => { this.showErrMsg(status + ', ' + statusText, 'danger') },
        () => this.hideLoading()
      )
    },
    acceptTripOrder: function (id) {
      this.showLoading('处理中......')

      acceptTripOrder(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功', 'success')
            this.refreshOrderDetail(id)
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        null,
        () => { this.hideLoading() }
      )
    },
    denyTripOrder: function (id, denyCode, denyReason) {
      this.showLoading('处理中......')

      const params = { 'reasonCode': denyCode, 'reasonDesc': denyReason }

      denyTripOrder(id, params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功', 'success')
            this.refreshOrderDetail(id)
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        null,
        () => { this.hideLoading() }
      )
    },
    showTripDetail: function (id) {
      this.$router.push('/trip/' + id)
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
