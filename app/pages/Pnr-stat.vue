<template>
	<div id="pnr-stat" class="row">
    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>

    <div class="col-12" v-show="filterShowing">
      <div class="col-12 text-right mt-3 mr-5">              
        <button type="button" class="btn btn-sm btn-info" @click.stop="resetFilter()">重置</button>
        <button type="button" class="btn btn-sm btn-success" @click.stop="hideFilter()">确定</button>
      </div>

      <div class="card col-12 mt-2 card-outline-primary">
        <div class="card-block">
          <div class="card-title">查询条件</div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="etermUsername">
          </div>
          <div class="form-group">
              <input class="form-control" id="beginDate" type="text" placeholder="开始日期" v-model="beginDate">
          </div>
          <div class="form-group">
              <input class="form-control" id="endDate" type="text" placeholder="截止日期" v-model="endDate">
          </div>
        </div>
      </div>      
    </div>
    <div class="col-12" v-show="filterShowing === false">
      <div class="col-12 bg-info text-white text-center ">
        <span @click='back()' class="float-left">
          <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        </span>
        PNR统计 
        <span @click="showFilter()" class="float-right">
          <i class="fa fa-filter fa-2" aria-hidden="true"></i>
        </span>
      </div> 
        
      <div class="card col-12 px-0 mb-2">   
        <table class='table table-sm table-striped'>
          <thead>
              <tr>
                  <th>用户名</th>
                  <th>数量</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for='(info, index) in dataList' >
                  <td>{{info.etermUsername}}</td>
                  <td>{{info.pnrCount}}</td>
              </tr>
          </tbody>
        </table>
      </div>      
    </div>     



  </div>
</template>

<script>
import { statPnr } from '../api/pnr.js'
import $ from 'jquery'

export default {
  data () {
    return {
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
      beginDate: '',
      endDate: ''
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    var self = this
    $('#beginDate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.beginDate = dateText
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })

    $('#endDate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.endDate = dateText
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })

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

      console.log(this.etermUsername + ',' + this.beginDate + ',' + this.endDate)

      var params = {
        'etermUsername': self.etermUsername,
        'beginDate': self.beginDate,
        'endDate': self.endDate
      }

      statPnr(params,
        (jsonResult) => { self.dataList = jsonResult.dataList },
        (status, statusText) => {},
        () => { self.loading = false }
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
