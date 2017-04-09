<template>
	<div id="tmc-detail" class="row">

    <div class="col-12 bg-info text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      政策详情
    </div> 

    <template v-if="detail">
      <div class="card col-12">
        <table class="table table-sm">
          <tbody>
            <tr><td class="text-right text-muted">航司</td><td>{{detail.carrier}}</td></tr>
            <tr><td class="text-right text-muted">舱位</td><td>{{detail.subclass}}</td></tr>
            <tr><td class="text-right text-muted">出发机场</td><td>{{getPortDesc(detail.dport)}}</td></tr>
            <tr><td class="text-right text-muted">到达机场</td><td class="text-truncate">{{getPortDesc(detail.aport)}}</td></tr>
            <tr><td class="text-right text-muted">返点</td><td>{{detail.returnPoint}}</td></tr>
            <tr><td class="text-right text-muted">可开数量</td><td>{{detail.ticketLimit}}</td></tr>
            <tr><td class="text-right text-muted">最低票面</td><td>{{detail.minPrice}}</td></tr>
            <tr><td class="text-right text-muted">最早旅行日期</td><td>{{detail.minDdate}}</td></tr>
            <tr><td class="text-right text-muted">最晚旅行日期</td><td>{{detail.maxDdate}}</td></tr>
            <tr><td class="text-right text-muted">退票规则</td><td>{{detail.refundRule}}</td></tr>
            <tr><td class="text-right text-muted">更改规则</td><td>{{detail.changeRule}}</td></tr>
            <tr><td class="text-right text-muted">签转规则</td><td>{{detail.endorseRule}}</td></tr>
            <tr><td class="text-right text-muted">政策类型</td><td>{{getIntlPolicyDesc(detail.intlPolicy)}}</td></tr>
            <tr><td class="text-right text-muted">行程类型</td><td>{{getRouteTypeDesc(detail.routeType)}}</td></tr>
            <tr><td class="text-right text-muted">备注</td><td>{{detail.remark}}</td></tr>
            <tr><td class="text-right text-muted"></td><td>{{getStatusDesc(detail.status)}}</td></tr>
          </tbody>
        </table>
      </div>  
    </template>     
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: '数据加载中'
    }
  },
  computed: {
    detail () { return this.$store.state.policyDetail }
  },
  mounted: function () {
    // this.search()
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
      if (val === undefined || val === null) return ''

      var desc = val
      if (val === '*') desc = '全国'
      if (val.length > 10) {
        desc = val.substring(0, 11) + '...'
      }
      return desc
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
