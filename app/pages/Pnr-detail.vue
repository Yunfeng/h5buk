<template>
	<div id="pnr-detail" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click='back()' class="float-left">
        <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        <small>返回</small>
      </span>
      PNR详情
    </div> 

    <template v-if="detail">
      <div class="card col-12" style="padding: 0">
        <table class="table table-sm">
          <tbody>
            <tr><td class="text-right small">编码</td><td>{{detail.pnrNo}}</td></tr>
            <tr><td class="text-right small">大编码</td><td>{{detail.bigPnrNo}}</td></tr>
            <tr><td class="text-right small">航段状态</td><td>{{detail.segStatus}}</td></tr>
            <tr><td class="text-right small">航段数</td><td>{{detail.segCount}}</td></tr>
            <tr><td class="text-right small">乘客数</td><td>{{detail.psgCount}}</td></tr>
            <tr><td class="text-right small">eterm用户名</td><td>{{detail.etermUsername}}</td></tr>
            <tr><td class="text-right small">更新时间</td><td>{{formatTime(detail.lastUpdate)}}</td></tr>

          </tbody>
        </table>
        <div class="card-block bg-faded" v-if="detail.pnrDetail != null " style="padding: 0">
          <div v-html="'<pre>' + detail.pnrDetail + '</pre>'">
          </div>
        </div>    
      </div>            
    </template>     

  </div>
</template>

<script>
import $ from 'jquery'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
  name: 'PnrDetail',
  computed: {
    detail () { return this.$store.state.pnrDetail }
  },
  mounted: function () {
    // this.search()
    var id = this.$route.params.id
    if (id !== undefined) {
      console.log(id)
      this.refreshPnrDetail(id)
    }
  },
  activated: function () {
    var id = this.$route.params.id
    console.log(id)
    if (id !== undefined) {
      this.refreshPnrDetail(id)
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
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
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    },
    refreshPnrDetail: function (id) {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        url: '/Flight/pnr/' + id,
        dataType: 'json',
        success: function (info) {
          if (info !== null) {
            self.$store.commit('setPnrDetail', info)
          }
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
    }
  }
}
</script>
