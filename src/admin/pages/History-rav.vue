<template>
	<div id="art-list" class="row">
    <div class="col-12 bg-primary text-center text-white">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </span>
        航班查询记录
    </div>
    <div class="card col-12">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>出发</th>
            <th>到达</th>
            <th>日期</th>
            <th>openid</th>
            <th>ip</th>
            <th>修改时间</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in dataList">
            <tr>
              <td>{{info.dcity}}</td>
              <td>
                {{info.acity}}
              </td>
              <td>
                {{info.ddate}}
              </td>
              <td>
                {{info.openId}}
              </td>
              <td>
                {{info.ip}}
              </td>
              <td>
                <template v-if="info.lastupdate !== null">
                  {{formatDateTime(info.lastupdate)}}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class='card-block'>
          <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </div> 
    </div>

  </div>
</template>

<script>
import MyPagination from '../../components/my-pagination.vue'
import { searchHistoryRav } from '../../api/admin.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  name: 'HistoryRav',
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
  computed: {
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

      var params = { 'pageNo': this.sc.pageNo,
        'pageSize': this.sc.pageSize
      }

      searchHistoryRav(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
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
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log('i m in.')
    })
  }
}
</script>
