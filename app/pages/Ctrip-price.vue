<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fixed-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      底价管理
    </div> 

    <div class="card col-12 mt-4">
      <table class="table table-sm table-striped table-condensive">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位</th>
                <th>底价</th>
                <th>出发</th>
                <th>到达</th>
                <th>航班</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" @click="showDetail(info)">
                <td>{{info.carrier}}</td>
                <td>{{info.subclass}}</td>
                <td>{{info.returnPoint}}</td>
                <td>{{info.minPrice}} 
                  <i class="fa fa-angle-right text-warning float-right fa-2" aria-hidden="true"></i>
                </td>
            </tr>
        </tbody>
      </table>
      <div class="card-block">
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
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
import MyPagination from '../components/my-pagination.vue'
import { searchBottomPrice } from '../api/ctrp.js'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      loading: false,
      loadingText: '数据加载中',

      dataList: [],

      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      carrier: '',
      subclass: '',
      dport: '',
      aport: ''
    }
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
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize,
        'sc.carrier': this.carrier,
        'sc.subclass': this.subclass,
        'sc.departureAirport': this.dport,
        'sc.arrivalAirport': this.aport
      }

      searchBottomPrice(params,
        (jsonResult) => {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
        },
        null,
        () => {
          this.loading = false
        }
      )
    },
    prevPage: function () {
      this.sc.pageNo = this.sc.pageNo - 1
      if (this.sc.pageNo < 1) this.sc.pageNo = 1
      this.search()
    },
    nextPage: function () {
      this.sc.pageNo = this.sc.pageNo + 1
      this.search()
    },
    directPage: function (pageNo) {
      this.sc.pageNo = pageNo
      this.search()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
