<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        <span class="fa-2">机票订单</span>
    </div> 
    <template v-if="orders.length > 0">
      <div class="card col-12"  v-for="info in orders" @click="showDetail(info)" :class="changeBgByStatus(info.status)">
        <div class="card-block mt-1 mb-2 p-0">          
          <small>订单日期：{{info.createDate}}</small> <br />
          <small>{{info.shortDesc}}</small><br />
          
          <small>订单状态：</small><span>{{showStatusDesc(info.status)}}</span>
          <span class="float-right"><small>总金额：</small>{{info.totalPrice}}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="col-12 text-success text-center">
        <div class="card-block">
          还没有机票订单，现在就去<router-link to="/search">预定</router-link>!
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { searchOrders, showOrderStatusDesc } from '../api/order.js'

export default {
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
        (status, statusText) => {
          if (status === 403) {
            this.$store.commit('jumpToLogin', this.$router)
          }
        },
        () => this.hideLoading()
      )
    },
    showDetail: function (orderInfo) {
      // this.$store.commit('setOrderDetail', orderInfo)
      this.$router.push('/order/detail/' + orderInfo.id)
    },
    showStatusDesc: function (status) {
      return showOrderStatusDesc(status)
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
