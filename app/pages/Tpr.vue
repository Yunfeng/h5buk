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
      <div class="card col-12 hidden-md-down">
        <form class="form-inline">
          <my-date-picker :id="'sellDate0'" :class="'form-control m-2'" :placeholder="'日期'" v-model="sellDate"></my-date-picker> 
          <input class="form-control m-2 col-2" type="text" placeholder="设备号" v-model="deviceId">
          <button type="button" class="btn btn-success mr-2" @click.stop="search()">确定</button>
          <button type="button" class="btn btn-info btn-sm" @click.stop="resetFilter()">重置</button>          

          <button type="button" class="btn btn-info ml-auto" @click.stop="download()">下载</button>
        </form>
        
      </div>
      <div class="card col-12 px-0">
        <table class="table table-sm table-striped table-condensive">
          <thead>
              <tr>
                  <th>日期</th>
                  <th class="hidden-sm-down">设备号</th>
                  <th>票号</th>
                  <th>编码</th>
                  <th>ctcm</th>
                  <th>eterm用户名</th>
                  <th>psgName</th>
                  <!-- <th>carrier</th> -->
                  <!-- <th>segInfo</th> -->
                  <!-- <th>flightNo</th> -->
                  <!-- <th>subclass</th> -->
                  <!-- <th>fltDate</th> -->
                  <th>totalFare</th>
                  <!-- <th>luggage</th> -->
                  <!-- <th>isUsed</th> -->
                  <th>linkPhone</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(flight, index) in dataList">
                <td><small>{{flight.sellDate.substring(5)}}</small></td>
                <td class="hidden-sm-down"><small>{{flight.deviceId}}</small></td>
                <td class="text-nowrap">{{flight.ticketNo}}</td>
                <td>{{flight.pnrNo}}</td>
                <td>{{flight.ctcmCount}}</td>   
                <td>{{showAbbr(flight.etermUsername)}}</td>   
                <td>{{flight.psgName}}</td>   
                <!-- <td>{{flight.carrier}}</td>    -->
                <!-- <td>{{showAbbr(flight.segInfo)}}</td>    -->
                <!-- <td>{{showAbbr(flight.flightNo)}}</td>    -->
                <!-- <td>{{flight.subclass}}</td>    -->
                <!-- <td>{{showAbbr(flight.fltDate)}}</td>    -->
                <td>{{flight.totalFare}}</td>   
                <!-- <td>{{flight.luggage}}</td>    -->
                <!-- <td>{{flight.isUsed}}</td>    -->
                <td>{{flight.linkPhone}}</td>   
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
            <my-date-picker :id="'sellDate1'" :class="'form-control'" :placeholder="'日期'" v-model="sellDate"></my-date-picker> 
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
import MyDatePicker from '../components/my-datepicker.vue'
import { searchTpr } from '../api/pnr.js'

export default {
  name: 'TprList',
  components: {
    MyPagination,
    MyDatePicker
  },
  data () {
    return {
      detailShowing: false,
      filterShowing: false,
      pnrDetail: '',

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 100,
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
      this.showLoading()

      var deviceId = this.deviceId
      if (deviceId === '') {
        deviceId = 0
      }

      var sellDate = this.sellDate
      if (sellDate === '') {
        sellDate = null
      }

      var params = { 'sellDate': sellDate,
        'device': deviceId,
        'pageSize': this.sc.pageSize,
        'pageNo': this.sc.pageNo
      }

      searchTpr(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
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
    },
    showAbbr: function (val) {
      if (val !== null && val.length > 10) {
        return val.substring(0, 10) + '...'
      } else {
        return val
      }
    },
    download: function () {
      var deviceId = this.deviceId
      if (deviceId === '') {
        deviceId = 0
      }

      var sellDate = this.sellDate
      if (sellDate === '') {
        sellDate = null
      }

      var url
      if (sellDate === null) {
        url = '/Flight/flights/tprs/download?device=' + deviceId
      } else {
        url = '/Flight/flights/tprs/download?sellDate=' + sellDate + '&device=' + deviceId
      }

      window.open(url)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
