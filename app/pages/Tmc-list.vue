<template>  
	<div id="policies" class="row">
    <div class="col-12 bg-info text-white text-center">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      <span class="fa-2">政策</span>
    </div> 

    <div class="card col-12">
      <table class="table table-striped table-sm">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位</th>
                <th>出发</th>
                <th>到达</th>
                <th>返点</th>
                <th>票面</th>
                <th class="d-none">备注</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList" @click="showDetail(info)">
                <td>{{info.carrier}}</td>
                <td>{{showSubclass(info.subclass)}}</td>
                <td>{{getPortDesc(info.dport)}}</td>
                <td>{{getPortDesc(info.aport)}}</td>
                <td>{{info.returnPoint}}</td>
                <td>{{info.minPrice}}</td>
                <td class="d-none">{{showShortDesc(info.remark)}}</td>
                <th>
                  <i class="fa fa-angle-right text-warning float-right fa-2 pr-2" aria-hidden="true"></i>
                </th>
            </tr>
        </tbody>
      </table>
      <div class="card-block">
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
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
        pageSize: 10,
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
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        url: '/Flight/policies/',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.policyType': -1,
          'sc.intlPolicy': -1
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false

          if (XMLHttpRequest.status === 403) {
            self.showErrMsg('您可能需要先登录，或申请授权')
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
        }
      })
    },
    showDetail: function (info) {
      this.$store.commit('setPolicyDetail', info)
      this.$router.push('/policy/' + info.id)
    },
    getIntlPolicyDesc: function (val) {
      var desc = '国内'
      if (val === 1) desc = '国际'

      return desc
    },
    getRouteTypeDesc: function (val) {
      var desc = '单程'
      if (val === 1) desc = '往返'
      return desc
    },
    getStatusDesc: function (val) {
      var desc = '启用中'
      if (val === 0) desc = '停用'
      return desc
    },
    getPortDesc: function (val) {
      // console.log(val + ', ' + val.length)
      var desc = val
      if (val === '*') {
        desc = '全国'
      } else if (val.length > 7) {
        desc = val.substring(0, 7) + '...'
      }  
      return desc
    },
    showSubclass: function (val) {
      if (val === undefined || val === null) {
        return val
      } else if (val.length < 4) {
        return val
      } else {
        return val.substring(0, 3) + '...'
      }
    },
    showShortDesc: function (val) {
      if (val === undefined || val === null || val.length < 10) {
        return val
      } else {
        return val.substring(0, 10 + '...')
      }
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
