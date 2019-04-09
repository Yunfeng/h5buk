<template>
	<div id="art-list" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2">
        旅游线路
    </div>
    <template v-for="(info, index) in dataList">  
      <div class="card col-12 border-top-0">
        <div class="card-block px-0" @click="showDetail(info)">
          <p class="card-text">{{showShortName(info.name)}}</p>
          <p class="small">
            <span class="text-info">{{info.dcity}}</span> 出发
            <i class="fa fa-angle-right text-warning float-right fa-2" aria-hidden="true"></i>
          </p>
          
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { searchTrips } from '../api/trip.js'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
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

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchTrips(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
    },
    showDetail: function (info) {
      var path = '/trip/' + info.id
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
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    showShortName: function (val) {
      if (val.length > 20) {
        return val.substring(0, 20) + '...'
      } else {
        return val
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
