<template>
	<div id="pnr-ctct" class="row">
    <template v-if="filterShowing === false && detailShowing === false">
      <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
          <small>返回</small>
        </span>
        缺 CTCT 列表
      </div>         

      <div class="card col-12 px-0">
        <table class="table table-striped table-condensive">
          <thead>
              <tr>
                  <th class="small">编码</th>
                  <th class="hidden-sm-down">人数/ctcm</th>
                  <th class="hidden-sm-down">状态</th>
                  <th class="small">用户名</th>
                  <th class="hidden-sm-down">生成时间</th>
                  <th class="small">更新时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList"  @click="showDetail(info)">
                  <td>{{info.pnrNo}}</td>
                  <td class="hidden-sm-down">{{info.psgCount}}/{{info.ctcmCount}}</td>
                  <td class="hidden-sm-down">{{info.segStatus}}</td>
                  <td>{{info.etermUsername}}</td>
                  <td class="hidden-sm-down"><small>{{convertLongToTimeDesc(info.createTime)}}</small></td>
                  <td><small>{{convertLongToTimeDesc(info.lastUpdate)}}</small></td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
      </div>      
    </template>      

    <template v-if="filterShowing">
      <div class="col-12 text-right mt-3 mr-5">              
        <button type="button" class="btn btn-sm btn-info" @click.stop="resetFilter()">重置</button>
        <button type="button" class="btn btn-sm btn-success" @click.stop="hideFilter()">确定</button>
      </div>

      <div class="card col-12 mt-2 card-outline-primary">
        <div class="card-block">
          <div class="card-title">查询条件</div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="请输入航司两字代码" v-model="carrier">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="etermUsername">
          </div>
        </div>
      </div>
    </template>

    <template v-if="detailShowing">
      <div class="col-12 bg-info text-white text-center">
        <span @click="hideDetail()" class="float-left">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        </span>
        编码详情
      </div> 

      <div class="weui-cell" v-if="pnrDetail != null ">
        <div v-html="'<pre>' + pnrDetail + '</pre>'"></div>        
      </div>  
    </template>

  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import $ from 'jquery'

export default {
  name: 'PnrCtct',
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
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
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    search: function () {
      var self = this

      self.showLoading()

      $.ajax({
        type: 'post',
        url: '/Flight/pnr/searchCtct.do',
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
          self.hideLoading()
        }
      })
    },
    showDetail: function (info) {
      // this.pnrDetail = info.pnrDetail
      // this.detailShowing = true
      this.$store.commit('setPnrDetail', info)
      var path = '/pnr/detail/' + info.id
      this.$router.push(path)
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
