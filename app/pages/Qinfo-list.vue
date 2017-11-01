<template>
	<div id="qinfo-list" class="row">
    <template v-if="detailShowing === false && filterShowing == false">  
      <div class="col-12 bg-info text-center text-white fa-2 sticky-top">
          <span @click="back()" class="float-left">
            <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
            <small>返回</small>
          </span>
          Q 列表
          <span @click="showFilter()" class="float-right mr-1">
            <i class="fa fa-filter" aria-hidden="true"></i>
          </span>   
      </div>         

      <div class="card col-12 px-0">
        <table class="table table-striped table-condensive">
          <thead>
              <tr>
                  <th class="hidden-xs-down">序号0</th>
                  <th>类型</th>
                  <th>用户名</th>
                  <th>记录编号</th>
                  <th class="hidden-xs-down">联系电话</th>
                  <th class="hidden-xs-down"></th>
                  <th class="hidden-xs-down"></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(flight, index) in qinfoes">
                      <td class="hidden-xs-down">{{flight.id}}</td>
                      <td>
                          {{flight.qtype}}
                      </td>
                      <td>{{flight.username}}</td>
                      <td>
                          <a href="javascript:void(0);" :title="flight.qdetail" data-toggle="tooltip" @click="showPnrDetail(flight.qdetail)">{{flight.pnrno}}</a>
                      </td>
                      <td class="hidden-xs-down">
                          {{flight.linkphone}}
                      </td>
                      <td class="hidden-xs-down">
                          <span v-if="flight.beManaged === '2'">
                              <button class="btn btn-info btn-xs" @click="reInform(index)">再次通知</button>
                          </span>
                      </td>
                      <td class="hidden-xs-down">
                          {{flight.createDate.substring(0, 10)}} {{flight.createTime}}
                      </td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
      </div> 

    </template>


    <template v-if="detailShowing">
      <div class="col-12 bg-info  text-center text-white">
          <span @click="hideDetail()"  class="float-left"><i class="fa fa-angle-left fa-2" aria-hidden="true"></i></span>
          编码详情
      </div> 
      <div class="card col-12" v-if="pnrDetail != null ">
        <div v-html="'<pre>' + pnrDetail + '</pre>'"></div>        
      </div>  

    </template>


    <template  v-if="filterShowing">
      <div class="col-12 text-right mt-3 mr-5">              
        <button type="button" class="btn btn-sm btn-info" @click.stop="resetFilter()">重置</button>
        <button type="button" class="btn btn-sm btn-success" @click.stop="hideFilter()">确定</button>
      </div>

      <div class="card col-12 mt-2 card-outline-primary">
        <div class="card-block">
          <div class="card-title">查询条件</div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="请输入编码" v-model="pnrNo">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="请输入用户名" v-model="username">
          </div>
          <div class="form-group">
              <select class="form-control" v-model="qtype">
                <option value="">全部</option>
                <option value="SC">SC</option>
                <option value="KK">KK</option>
              </select>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'

import $ from 'jquery'

export default {
  name: 'QinfoList',
  components: {
    MyPagination
  },
  data () {
    return {
      detailShowing: false,
      filterShowing: false,
      pnrDetail: '',

      qinfoes: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      pnrNo: '',
      username: '',
      qtype: ''
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
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
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
        url: '/Flight/qinfoes/',
        data: {
          'sc.pageNo': self.sc.pageNo,
          'sc.pageSize': self.sc.pageSize,
          'sc.pnrNo': self.pnrNo,
          'sc.username': self.username,
          'sc.qtype': self.qtype
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.qinfoes = jsonResult.dataList
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
    showPnrDetail: function (qdetail) {
      this.detailShowing = true
      this.pnrDetail = qdetail
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
      this.pnrNo = ''
      this.username = ''
      this.qtype = ''
    },
    reInform: function (index) {
      var id = this.qinfoes[index].id
      var self = this

      $.ajax({
        type: 'post',
        url: '/Flight/qinfoes/reInformQinfo.do',
        data: { id: id },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.search()
          } else {
            self.showErrMsg('操作失败')
          }
        }
      })
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
