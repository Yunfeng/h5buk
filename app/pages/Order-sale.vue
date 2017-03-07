<template>
	<div id="order" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          卖家订单
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <div class="card col-12" v-for="info in orders" @click="showDetail(info)">
        <div class="card-block"  style="padding: 0;">          
          <p class="card-text">{{info.shortDesc}}</p>
          <span class="float-right">总金额：{{info.totalPrice}}</span>
          <span>订单状态：{{showStatusDesc(info.status)}}</span>
        </div>
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

export default {
  data () {
    return {
      errAlert: false,
      errMsg: '',
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
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        url: '/Flight/orders/searchSellerOrder.do',
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
      this.$store.commit('setOrderDetail', orderInfo)
      this.$router.push('/order/detail')
    },
    showStatusDesc: function (status) {
      var desc = ''
      switch (status) {
        case 0: desc = '待接单'; break
        case 1: desc = '待支付'; break
        case 2: desc = '确认中 '; break
        case 4: desc = '已拒单'; break
        case 8: desc = '待开票'; break
        case 12: desc = '开票中'; break
        case 16: desc = '待确认'; break
        case 32: desc = '待结算'; break
        case 64: desc = '已完成'; break
        case 128: desc = '已取消'; break
        case 1024: desc = '未提交'; break
        default:
          desc = status
      }
      return desc
    },
    showIdTypeDesc: function (idType) {
      var desc = ''
      switch (idType) {
        case '1': desc = '身份证'; break
        case '2': desc = '护照'; break
      }
      return desc
    },
    convertLongToTimeDesc: function (l) {
      return this.getFormatDate(new Date(l))
    },
    getFormatDate: function (date, pattern) {
      if (date === undefined) {
        date = new Date()
      }
      if (pattern === undefined) {
        pattern = 'yyyy-MM-dd hh:mm:ss'
      }
      return date.format(pattern)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
