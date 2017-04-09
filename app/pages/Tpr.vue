<template>
	<div id="tpr-list" class="row">
    <template v-if="filterShowing == false">  
        <div class="col-12 bg-info text-center text-white fa-2 sticky-top">
            <span @click="back()" class="float-left ml-1">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
              <small>返回</small>
            </span>
            机票销售报表数据
            <span @click="showFilter()" class="float-right mr-1">
              <i class="fa fa-filter" aria-hidden="true"></i>
            </span>   
        </div>         

      <div class="card col-12 px-0">
        <table class="table table-sm table-striped table-condensive">
          <thead>
              <tr>
                  <th class="hidden-xs-down">序号</th>
                  <th>日期</th>
                  <th class="hidden-sm-down">设备号</th>
                  <th>票号</th>
                  <th>编码</th>
                  <th>ctcm</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(flight, index) in qinfoes">
                <td class="hidden-xs-down">{{flight.id}}</td>
                <td><small>{{flight.sellDate.substring(5)}}</small></td>
                <td class="hidden-sm-down"><small>{{flight.deviceId}}</small></td>
                <td>
                    {{flight.ticketNo}}
                </td>
                <td><small>{{flight.pnrNo}}</small></td>
                <td><small>{{flight.ctcmCount}}</small></td>                      
              </tr>
          </tbody>
        </table>
        <div class='card-block'>
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
              <input class="form-control" type="text" placeholder="销售日期，格式：yyyy-MM-dd" v-model="sellDate">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="设备号" v-model="deviceId">
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
  name: 'TprList',
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
        pageSize: 1000,
        pageTotal: 0
      },
      sellDate: '',
      deviceId: ''
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    // console.log(this.qinfoes.length);
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

      var deviceId = self.deviceId
      if (deviceId === '') {
        deviceId = 0
      }

      var sellDate = self.sellDate
      if (sellDate === '') {
        sellDate = null
      }

      $.ajax({
        type: 'post',
        url: '/Flight/flights/tprs/',
        data: {
          'sellDate': sellDate,
          'device': deviceId,
          'pageSize': self.sc.pageSize,
          'pageNo': self.sc.pageNo
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
    showFilter: function () {
      this.filterShowing = true
    },
    hideFilter: function () {
      this.filterShowing = false
      this.search()
    },
    resetFilter: function () {
      this.sellDate = ''
      this.deviceId = ''
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
