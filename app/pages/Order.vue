<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left"><i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        我的订单
        <span class="float-right bg-white">
          <router-link to="/order/sale" class="text-danger">
            <small>我是卖家</small>
          </router-link>          
        </span>
    </router-link>
    </div> 

      <div class="card col-12"  v-for="info in orders" @click="showDetail(info)">
        <div class="card-block mt-1 mb-2 p-0">          
          <small>{{info.shortDesc}}</small><br />
          <span class="float-right"><small>总金额：</small>{{info.totalPrice}}</span>
          <span><small>订单状态：</small>{{showStatusDesc(info.status)}}</span>
        </div>
      </div>

    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
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
      loading: false,
      loadingText: '数据加载中',
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
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

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
          self.loading = false
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
