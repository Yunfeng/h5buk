<template>
	<div id="pnr-detail" class="container-fluid">
    <div id='loadingToast' v-show='loading'>
      <div class='weui-mask_transparent'></div>
      <div class='weui-toast'>
        <i class='weui-loading weui-icon_toast'></i>
        <p class='weui-toast__content'>{{loadingText}}</p>
      </div>
    </div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          PNR详情
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <template v-if="detail">
        <div class="card col-12" style="padding: 0">
          <table class="table table-sm">
            <tbody>
              <tr><td class="text-right">编码</td><td>{{detail.pnrNo}}</td></tr>
              <tr><td class="text-right">大编码</td><td>{{detail.bigPnrNo}}</td></tr>
              <tr><td class="text-right">出发机场</td><td>{{getPortDesc(detail.departurePort)}}</td></tr>
              <tr><td class="text-right">到达机场</td><td>{{getPortDesc(detail.arrivalPort)}}</td></tr>
              <tr><td class="text-right">航班号</td><td>{{detail.flightNo}}</td></tr>
              <tr><td class="text-right">出发日期</td><td>{{detail.departureDate}}</td></tr>
              <tr><td class="text-right">舱位</td><td>{{detail.subClass}}</td></tr>
              <tr><td class="text-right">航段状态</td><td>{{detail.segStatus}}</td></tr>
              <tr><td class="text-right">航段数</td><td>{{detail.segCount}}</td></tr>
              <tr><td class="text-right">乘客数</td><td>{{detail.psgCount}}</td></tr>
              <tr><td class="text-right">eterm用户名</td><td>{{detail.etermUsername}}</td></tr>
              <tr><td class="text-right">更新时间</td><td>{{detail.updateTimeDesc}}</td></tr>
              <tr><td class="text-right"></td><td>{{formatTime(detail.lastUpdate)}}</td></tr>

            </tbody>
          </table>
          <div class="card-block bg-faded" v-if="detail.pnrDetail != null " style="padding: 0">
            <div v-html="'<pre>' + detail.pnrDetail + '</pre>'">
            </div>
          </div>    
          <div class="card-block text-center" v-if="detail.ctcmCount === 0">
            <button class="btn btn-success" @click.stop="fixPnrCtcm()">填充 CTCM</button>
          </div>    
        </div>    
        
      </template>     
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: '数据加载中'
    }
  },
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
    },
    fixPnrCtcm: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        timeout: 15000,
        url: '/Flight/pnr/ctcm/' + self.detail.id,
        dataType: 'json',
        success: function (info) {
          if (info !== null) {
            self.$store.commit('setPnrDetail', info)
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(textStatus)
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
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
