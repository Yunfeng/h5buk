<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      机票特殊政策
    </div> 

    <div class="card col-12 mt-4">
      <table class="table table-striped table-condensive">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位</th>
                <th>出发</th>
                <th>到达</th>
                <th>返点</th>
                <th>票面</th>
                <th class="hidden-md-down">备注</th>
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
                <td>>{{info.minPrice}} 
                  
                </td>
                <td class="hidden-md-down">{{showShortDesc(info.remark)}}</td>
                <th><i class="fa fa-angle-right text-warning float-right fa-2 pr-2" aria-hidden="true"></i></th>
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
      this.$router.push('/tmc/detail')
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
      var desc = val
      if (val === '*') desc = '全国'
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
      console.log(val)
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
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
