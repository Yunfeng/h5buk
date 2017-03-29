<template>
	<div id="order" class="row">
    <div class="col-12 bg-info text-center text-white">
      <span @click="back()" class="float-left"><i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
        销售订单      
    </div> 


    <div class="card col-12" v-for="info in orders" @click="showDetail(info)" :class="changeBgByStatus(info.status)">
      <div class="card-block"  style="padding: 0;">          
        <p class="card-text"><small>{{info.shortDesc}}</small></p>
        <span class="float-right">总金额：{{info.totalPrice}}</span>
        <span>订单状态：{{showStatusDesc(info.status)}}</span>
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
    changeBgByStatus: function (orderStatus) {
      switch (orderStatus) {
        case 0: return 'bg-info'
        case 8: return 'bg-success'
        case 12: return 'bg-warning'
        default: return 'bg-faded'
      }
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
    showDetail: function (info) {
      this.$router.push('/order/detail/' + info.id)
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
