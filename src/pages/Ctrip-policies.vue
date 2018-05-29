<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticy-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      特殊政策
    </div> 

    <div class="card col-12 mt-4 px-0">
      <table class="table table-sm table-striped table-condensive">
        <thead>
            <tr>
                <th>代码</th>
                <th>舱位</th>
                <th>出发</th>
                <th>监控</th>
                <th>备注</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" @click="showDetail(info)">
                <td>{{info.policyCode}}</td>
                <td>{{info.goSubClass}}</td>
                <td>{{info.departurePort}}</td>
                <td>{{info.monitorTime}}</td>
                <td>{{info.remark}}</td>
                <td>
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
import { searchSpecialPolicy } from '../api/ctrp.js'

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
      monitoring: 1
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
        'sc.arrivalAirport': this.aport,
        'sc.monitoring': this.monitoring
      }

      searchSpecialPolicy(params,
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
    showDetail: function (info) {
      this.$router.push('/ctrp/policy/' + info.id)
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
  }
}
</script>
