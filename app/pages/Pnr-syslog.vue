<template>
	<div id="pnr-ctct" class="row">

    <template v-if="detailShowing === false">
      <div class="col-12 bg-info text-white text-center ">
        <span @click='back()' class="float-left">
          <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        </span>
        系统日志        
      </div> 

      <div class="card col-12 px-0">
        <table class="table table-striped table-sm">
          <thead>
              <tr>
                  <th>编码</th>
                  <th class="hidden-sm-down">人数/ctcm</th>
                  <th class="hidden-sm-down">状态</th>
                  <th>内容</th>
                  <th>更新时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList"  @click="showDetail(info)">
                  <td>{{info.pnrNo}}</td>
                  <td class="hidden-sm-down">{{info.psgCount}}/{{info.ctcmCount}}</td>
                  <td class="hidden-sm-down">{{info.segStatus}}</td>
                  <td>{{info.remark}}</td>
                  <td><small>{{convertLongToTimeDesc(info.lastupdate)}}</small></td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
      </div>      
    </template>      

    <template v-if="detailShowing">
      <div class="col-2 bg-info">
          <span @click="hideDetail()"><i class="fa fa-angle-left text-white" aria-hidden="true"></i></span>
      </div>         
      <div class="col-8 text-center bg-info">
          编码详情
      </div>         
      <div class="col-2 bg-info">
      </div>          

      <div class="weui-cell" v-if="pnrDetail != null ">
        <div v-html="'<pre>' + pnrDetail + '</pre>'"></div>        
      </div>  

    </template>

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
import $ from 'jquery'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: '数据加载中',
      filterShowing: false,
      detailShowing: false,

      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 50,
        pageTotal: 0
      },
      carrier: '',
      etermUsername: '',

      dataList: [],
      pnrDetail: ''
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
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
        url: '/Flight/pnr/syslog',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
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
      this.pnrDetail = info.pnrDetail
      this.detailShowing = true
    },
    hideDetail: function () {
      this.detailShowing = false
    },
    showFilter: function () {
      this.filterShowing = true
    },
    hideFilter: function () {
      this.filterShowing = false
      this.search()
    },
    resetFilter: function () {
      this.carrier = ''
      this.etermUsername = ''
    },
    setCarrier: function (val) {
      this.carrier = val
      this.search()
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
    },
    convertLongToTimeDesc: function (l) {
      if (l === null) return ''
      return this.getFormatDate(new Date(l)).substring(5, 16)
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
