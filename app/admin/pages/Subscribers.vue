<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      微信关注者信息
    </div> 

    <div class="card col-12 mt-4 px-0">
      <table class="table table-sm table-striped table-condensive">
        <thead>
            <tr>
                <th></th>
                <th>nickname</th>
                <th>province</th>
                <th>city</th>
                <th></th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{index+1}}</td>
                <td>{{info.nickname}}</td>
                <td>{{info.province}}</td>
                <td>{{info.city}}</td>
                <td>{{formatDateTime(info.subscribe_time)}}</td>
                <td>
                  <img class="d-flex mr-3" :src="info.headimgurl" style="width: 2rem; height: 2rem">
                </td>
            </tr>
        </tbody>
      </table>
      <div class="card-block">
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
      </div>
    </div>
            
  </div>
</template>

<script>
import MyPagination from '../../components/my-pagination.vue'
import { searchSubscribers } from '../../api/admin.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      }
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
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    search: function () {
      this.showLoading()

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchSubscribers(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
          console.log(this.sc)
        },
        null,
        () => this.hideLoading()
      )
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
    formatDateTime: function (val) {
      return convertLongToTimeDesc(val)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
