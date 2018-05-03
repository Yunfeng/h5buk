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
        <table class="table table-sm small">
          <tbody>
            <tr>
              <td class="text-right text-info" style="min-width: 5rem">航司</td>
              <td>
                {{detail.carrier}}
                <button class="btn btn-info btn-sm float-right" @click.stop="selectPolicy(detail.id)">采购</button>
              </td>
            </tr>
            <tr>
                <td class="text-right text-info">去程舱位</td>
                <td>{{detail.subclass}}</td>
            </tr>
            <tr class="backFlightInfo" v-if="detail.routeType === 1">
                <td class="text-right text-info">回程舱位</td>
                <td>{{detail.backSubclass}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">类型</td>
                <td>
                  {{getPolicyTypeDesc(detail.policyType)}}-{{getIntlPolicyDesc(detail.intlPolicy)}}-{{getRouteTypeDesc(detail.routeType)}}
                </td>
            </tr>
            <tr>
              <td class="text-right">出发机场</td>
              <td>
                <a href="javascript:void(0)" data-toggle="tooltip" :title="detail.dport">{{getPortDesc(detail.dport)}}</a>
                </td>
            </tr>
            <tr>
              <td class="text-right">到达机场</td>
              <td>
                  {{detail.aport}}
                  <span v-if="detail.excludeAirports">除外: {{detail.excludeAirports}}</span>
              </td>
            </tr>
            <tr>
                <td class="text-right text-info">去程排除航班</td>
                <td>{{detail.goExcludeFlightNo}}</td>
            </tr>
            <tr class="backFlightInfo"  v-if="detail.routeType === 1">
                <td class="text-right text-info">回程排除航班</td>
                <td>{{detail.backExcludeFlightNo}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">去程旅行日期</td>
                <td>开始: {{detail.minDdate}} <br />结束: {{detail.maxDdate}}</td>
            </tr>
            <tr class="backFlightInfo"  v-if="detail.routeType === 1">
                <td class="text-right text-info">回程旅行日期</td>
                <td>开始: {{detail.minBackDate}} <br />结束: {{detail.maxBackDate}}</td>
            </tr>
            <tr v-if="detail.advanceDays > 0">
                <td class="text-right text-info">提前预定天数 </td>
                <td>{{detail.advanceDays}} </td>
            </tr>
            <tr v-if="detail.maxCountUserDay > 0">
                <td class="text-right text-info">每用户每天可开数量 </td>
                <td>{{detail.maxCountUserDay}} </td>
            </tr>
            <tr v-if="detail.returnPoint > 0">
                <td class="text-right text-info">去程返点</td>
                <td>{{detail.returnPoint}}</td>
            </tr>
            <tr class="backFlightInfo"  v-if="detail.routeType === 1">
                <td class="text-right text-info">回程返点</td>
                <td>{{detail.backReturnPoint}}</td>
            </tr>
            <tr v-if="detail.returnMoney > 0">
                <td class="text-right text-info">返钱</td>
                <td>{{detail.returnMoney}}</td>
            </tr>
            <tr v-if="detail.minPrice > 0">
                <td class="text-right text-info">最低票面</td>
                <td>{{detail.minPrice}}</td>
            </tr>
            <tr v-if="detail.maxprice > 0">
                <td class="text-right text-info">最高票面</td>
                <td>{{detail.maxPrice}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">退票规则</td>
                <td>{{detail.refundRule}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">改期规则</td>
                <td>{{detail.changeRule}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">签转规则</td>
                <td>{{detail.endorseRule}}</td>
            </tr>
            <tr v-if="detail.ticketLimit < 5">
                <td class="text-right text-info">可开数量</td>
                <td>{{detail.ticketLimit}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">备注</td>
                <td>{{detail.remark}}</td>
            </tr>
            <tr>
                <td class="text-right text-warning">状态</td>
                <td>{{getStatusDesc(detail.status)}}</td>
            </tr>
            <tr>
                <td class="text-right text-info">发布时间</td>
                <td>{{detail.createTime}}</td>
            </tr>
            <tr>
                <td class="text-right text-info"></td>
                <td>
                  <button class="btn btn-success" @click.stop="selectPolicy(detail.id)">采购</button>
                </td>
            </tr>            
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
    selectPolicy: function (id) {
      this.$store.commit('setPolicyDetail', this.detail)
      this.$store.commit('setPolicyIdSelected', id)
      this.$router.push('/policy/' + id + '/buy')
    },
    getPolicyTypeDesc: function (val) {
      if (val === 1) {
        return '特殊-票面低'
      } else if (val === 0) {
        return '普通-票面相符'
      } else {
        return ''
      }
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
