<template>
	<div id='pnr-list' class='container-fluid'>
    
    <div class='weui-toptips weui-toptips_warn' style='display:block' v-show='errAlert'>{{errMsg}}</div>
    
    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>

    <template v-if="filterShowing">
      <div class="col-12 text-right mt-3 mr-5">              
        <button type="button" class="btn btn-sm btn-info" @click.stop="resetFilter()">重置</button>
        <button type="button" class="btn btn-sm btn-success" @click.stop="hideFilter()">确定</button>
      </div>

      <div class="card col-12 mt-2 card-outline-primary">
        <div class="card-block">
          <div class="card-title">查询条件</div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="编码" v-model="pnrNo">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="etermUsername">
          </div>
        </div>
      </div>      
    </template>
    <template v-else>
      <div class='row bg-info'>
        <div class='col-1'>
            <span @click='back()'><i class='fa fa-angle-left text-white' aria-hidden='true'></i></span>
        </div>         
        <div class='col-10 text-center'>
            PNR列表
        </div>         
        <div class='col-1'>
            <span @click="showFilter()">
              <i class="fa fa-filter text-white" aria-hidden="true"></i>
            </span>
        </div>         
      </div> 
        
      <div class='row'>
        <div class='card col-12' style="padding: 0">   
          <table class='table table-sm table-striped table-condensed'>
            <thead>
                <tr>
                    <th>编码</th>
                    <th></th>
                    <th>用户名</th>
                    <th class="hidden-md-down">CTCM</th>
                    <th class="hidden-md-down">联系电话</th>
                    <th class="hidden-md-down">生成时间</th>
                    <th class="hidden-sm-down">更新时间</th>
                    <th></th>
                </tr>                        
            </thead>
            <tbody>
                <tr v-for='(info, index) in dataList' @click='showDetail(info)'>
                    <td>{{info.pnrNo}}</td>
                    <td><small>{{info.segStatus}}</small></td>
                    <td>{{info.etermUsername}}</td>
                    <td class="hidden-md-down"><small>{{info.ctcmCount}}</small></td>
                    <td class="hidden-md-down"><small>{{info.linkphone}}</small></td>
                    <td class="hidden-md-down"><small>{{formatTime(info.createTime)}}</small></td>
                    <td class="hidden-sm-down"><small>{{formatTime(info.lastUpdate)}}</small></td>
                    <td><i class="fa fa-angle-right" aria-hidden="true"></i></td>
                </tr>
            </tbody>
          </table>
          <div class='card-block'>
            <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
          </div> 
        </div>      
      </div> 
    </template>     



  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import $ from 'jquery'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
  name: 'pnr-list',
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

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      etermUsername: '',
      pnrNo: ''
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    var temp = $.cookie('pnr.list.sc.pnrNo')
    if (temp !== undefined) this.pnrNo = temp

    temp = $.cookie('pnr.ctcm.sc.etermUsername')
    if (temp !== undefined) this.etermUsername = temp

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

      $.cookie('pnr.list.sc.pnrNo', this.pnrNo, { expires: 1, path: '/' })
      $.cookie('pnr.list.sc.etermUsername', this.etermUsername, { expires: 1, path: '/' })

      $.ajax({
        type: 'post',
        url: '/Flight/pnr/list.do',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.pnrNo': this.pnrNo,
          'sc.etermUsername': this.etermUsername
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
      this.$store.commit('setPnrDetail', info)
      var path = '/pnr/detail/' + info.id
      this.$router.push(path)
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
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    },
    showFilter: function () {
      this.filterShowing = true
    },
    hideFilter: function () {
      this.filterShowing = false
      this.search()
    },
    resetFilter: function () {
      this.etermUsername = ''
      this.pnrNo = ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
