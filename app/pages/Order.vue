<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        <span class="fa-2">机票订单</span>
    </router-link>
    </div> 

    <div class="card col-12"  v-for="info in orders" @click="showDetail(info)" :class="changeBgByStatus(info.status)">
      <div class="card-block mt-1 mb-2 p-0">          
        <small>{{info.shortDesc}}</small><br />
        <span class="float-right"><small>总金额：</small>{{info.totalPrice}}</span>
        <span><small>订单状态：</small>{{showStatusDesc(info.status)}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import { showOrderStatusDesc } from '../common/common.js'

export default {
  data () {
    return {
      detailShowing: false,
      orders: []
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail }
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
        case 32: return 'bg-white text-danger'
        case 128: return 'bg-faded text-muted'
        case 1024: return 'bg-white text-success'
        default: return 'bg-success'
      }
    },
    search: function () {
      var self = this

      self.showLoading()

      $.ajax({
        type: 'post',
        url: '/Flight/orders/search.do',
        data: {
          'sc.pageNo': 1
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            self.orders = jsonResult.dataList
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false

          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.hideLoading()
        }
      })
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
