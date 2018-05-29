<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        <span class="fa-2">订单</span>
    </div> 
    <template v-if="orders.length > 0">
      <div class="card col-12 px-0">
        <table class="table table-striped table-sm small">
          <thead>
            <tr>
              <th class="text-center">日期</th>
              <th class="text-center">出发</th>
              <th class="text-center">到达</th>
              <th class="text-right">金额</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="info in orders" @click="showDetail(info)">
              <td class="text-center">
                {{info.flights[0].departureDate}}
              </td>
              <td class="text-center">{{info.flights[0].departureAirportName}}</td>
              <td class="text-center">{{info.flights[0].arrivalAirportName}}</td>
              <td class="text-right">{{info.ticketAmount}}</td>
              <td class="" :class="changeBgByStatus(info.status)">
                {{showStatusDesc(info.status)}}
                <i class="fa fa-angle-right fa-2 float-right" aria-hidden="true"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <div class="col-12 text-success text-center">
        <div class="card-block">
          还没有订单，现在就去<router-link to="/search">预定</router-link>!
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { searchOrders, showOrderStatusDesc } from '../api/order.js'

export default {
  asyncData ({ store, route }) {
  },
  data () {
    return {
      detailShowing: false,
      orders: []
    }
  },
  computed: {
    // info () { return this.$store.state.orderDetail }
  },
  mounted: function () {
    this.search()
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
    changeBgByStatus: function (orderStatus) {
      switch (orderStatus) {
        case 1: return 'bg-success text-white'
        case 4: return 'bg-white text-info'
        case 8: return 'bg-white text-faded'
        case 16: return 'bg-success text-white'
        case 32: return 'bg-white text-danger'
        case 128: return 'bg-faded text-muted'
        case 1024: return 'bg-white text-success'
        default: return 'bg-success'
      }
    },
    search: function () {
      var params = { 'sc.pageNo': 1 }

      this.showLoading()

      searchOrders(params,
        (jsonResult) => {
          if (jsonResult !== null) { this.orders = jsonResult.dataList }
        },
        status => {
          if (status === 403) {
            this.showErrMsg('您可能需要先登录，或申请授权')
            this.$store.commit('jumpToLogin', this.$router)
          }
        },
        () => this.hideLoading()
      )
    },
    showDetail: function (orderInfo) {
      // this.$store.commit('setOrderDetail', orderInfo)
      this.$router.push('/order/' + orderInfo.id)
    },
    showStatusDesc: function (status) {
      return showOrderStatusDesc(status)
    }
  }
}
</script>
