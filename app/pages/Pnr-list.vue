<template>
	<div id="pnr-list" class="row">
    <template v-if="filterShowing">
      <div class="col-12 bg-info text-white text-right mr-5 fa-2">              
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
              <input class="form-control" type="text" placeholder="航司" v-model="carrier">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="etermUsername">
          </div>
          <div class="form-group">
              <my-date-picker :id="'beginDate0'" :class="'form-control'" :placeholder="'开始日期'" v-model="beginDate"></my-date-picker> 
          </div>
          <div class="form-group">
              <my-date-picker :id="'endDate0'" :class="'form-control'" :placeholder="'截止日期'" v-model="endDate"></my-date-picker>  
          </div>
          <div class="form-group">
            <select v-model="dzStatus" class="form-control" >
              <option value="-1">全部</option>
              <option value="0">未开票</option>
              <option value="1">已开票</option>
            </select>
          </div>
          <div class="form-group">
            <select v-model="orderBy" class="form-control" >
              <option value="0">ID降序</option>
              <option value="1">人数降序</option>
              <option value="2">用户名降序</option>
              <option value="3">状态降序</option>
            </select>
          </div>
          <div class="form-group">
            <select v-model="dataMode" class="form-control" >
              <option value="0">当前在用</option>
              <option value="1">已删除</option>
            </select>
          </div>
        </div>
      </div>      
    </template>
    <template v-else>
      <div class="col-12 bg-info text-white text-center fa-2">
        <span @click='back()' class="float-left">
          <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
          <small>返回</small>
        </span>
        PNR列表
        <span @click="showFilter()" class="float-right">
          <i class="fa fa-filter fa-2" aria-hidden="true"></i>
        </span>
      </div> 
        
      <div class="card col-12 hidden-md-down">
        <form class="form-inline">
          <input class="form-control m-2 col-1" type="text" placeholder="编码" v-model="pnrNo">
          <input class="form-control m-2 col-1" type="text" placeholder="航司" v-model="carrier">
          <input class="form-control m-2 col-1" type="text" placeholder="用户名" v-model="etermUsername">
          <my-date-picker :id="'beginDate1'" :class="'form-control m-2'" :style="'width:7rem'" :placeholder="'开始日期'" v-model="beginDate"></my-date-picker> 
          <my-date-picker :id="'endDate1'" :class="'form-control m-2'" :style="'width:7rem'"  :placeholder="'截止日期'" v-model="endDate"></my-date-picker>  
          <select v-model="dzStatus" class="form-control m-2" >
            <option value="-1">全部</option>
            <option value="0">未开票</option>
            <option value="1">已开票</option>
          </select>
          <select v-model="orderBy" class="form-control m-2" >
            <option value="0">ID降序</option>
            <option value="1">人数降序</option>
            <option value="2">用户名降序</option>
            <option value="3">状态降序</option>
          </select>
          <select v-model="dataMode" class="form-control m-2" >
            <option value="0">当前在用</option>
            <option value="1">已删除</option>
          </select>

          <button type="button" class="btn btn-success mr-2" @click.stop="hideFilter()">确定</button>
          <button type="button" class="btn btn-info btn-sm" @click.stop="resetFilter()">重置</button>          
        </form>        
      </div>

      <div class="card col-12 px-0">   
        <table class='table table-sm table-striped'>
          <thead class="text-warning sticky-top">
              <tr>
                  <th>编码</th>
                  <th class="hidden-md-down">出发</th>
                  <th class="hidden-md-down">段数</th>
                  <th>状态</th>
                  <th>人数</th>
                  <th>用户名</th>
                  <th class="hidden-md-down">CTCM</th>
                  <th class="hidden-md-down">联系电话</th>
                  <th class="hidden-md-down"></th>
                  <th class="hidden-md-down">生成时间</th>
                  <th class="hidden-sm-down">更新时间</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for='(info, index) in dataList' @click='showDetail(info)' :class="{'bg-success text-white': info.dzStatus}">
                  <td>{{info.pnrNo}}</td>
                  <td class="hidden-md-down small">
                    {{info.departurePort}}{{info.arrivalPort}} {{info.departureDate}}
                  </td>
                  <td class="hidden-md-down small">{{info.segCount}}</td>
                  <td><small>{{info.segStatus}}</small></td>
                  <td>{{info.psgCount}}</td>
                  <td>{{info.etermUsername}}</td>
                  <td class="hidden-md-down"><small>{{info.ctcmCount}}</small></td>
                  <td class="hidden-md-down"><small>{{info.linkphone}}</small></td>
                  <td class="hidden-md-down"><small>{{info.bookOfficeNo}}</small></td>
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
    </template>     
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import MyDatePicker from '../components/my-datepicker.vue'
import { convertLongToTimeDesc } from '../common/common.js'
import { searchPnr, searchPnrUsed } from '../api/pnr.js'

export default {
  name: 'PnrList',
  components: {
    'my-pagination': MyPagination,
    MyDatePicker
  },
  data () {
    return {
      filterShowing: false,

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      etermUsername: '',
      pnrNo: '',
      beginDate: '',
      endDate: '',
      dzStatus: -1,
      carrier: '',
      orderBy: 0,
      dataMode: '0'
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
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
    reset: function () {
      this.etermUsername = ''
      this.pnrNo = ''
      this.sc.pageNo = 1
    },
    search: function () {
      this.showLoading()

      var beginDate = this.beginDate
      if (beginDate === '') {
        beginDate = null
      }

      var endDate = this.endDate
      if (endDate === '') {
        endDate = null
      }

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize,
        'sc.pnrNo': this.pnrNo,
        'sc.etermUsername': this.etermUsername,
        'sc.beginDate': beginDate,
        'sc.endDate': endDate,
        'sc.orderBy': this.orderBy,
        'sc.dzStatus': this.dzStatus,
        'sc.carrier': this.carrier
      }

      if (this.dataMode === '0') {
        searchPnr(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          },
          null,
          () => { this.hideLoading() }
        )
      } else {
        searchPnrUsed(params,
          (jsonResult) => {
            this.dataList = jsonResult.dataList
            this.sc = jsonResult.page
          },
          null,
          () => { this.hideLoading() }
        )
      }
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
      this.beginDate = ''
      this.endDate = ''
      this.orderBy = 0
      this.carrier = ''
      this.dzStatus = -1
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.search()
    })
  }
}
</script>
