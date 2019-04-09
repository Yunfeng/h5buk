<template>
	<div id="pnr-alert1" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          待取消列表(NO状态) 
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <div class="card col-12">   
        <table class="table table-striped table-condensive">
          <thead>
              <tr>
                  <th>编码</th>
                  <th>备注</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList">
                  <td>{{info.pnrNo}}</td>
                  <td>{{info.remark}}</td>
                  <td>{{convertLongToTimeDesc(info.lastupdate)}}</td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
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
import $ from 'jquery'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: '数据加载中',

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      }
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
        url: '/Flight/pnr/searchAlert1.do',
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
      return this.getFormatDate(new Date(l))
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
