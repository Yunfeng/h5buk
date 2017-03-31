<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fixed-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      特殊政策 <small>{{info.id}}</small>
    </div> 

    <div class="card col-12 mt-4 px-0">
      <dl class="row">
        <dt class="col-4 text-right">政策代码</dt>
        <dd class="col-8">{{info.policyCode}}</dd>
        <dt class="col-4 text-right">航司</dt>
        <dd class="col-8">{{info.carrier}}</dd>
        <dt class="col-4 text-right">出发</dt>
        <dd class="col-8">{{info.departurePort}}</dd>
        <dt class="col-4 text-right">到达</dt>
        <dd class="col-8">{{info.arrivalPort}}</dd>
        <dt class="col-4 text-right">去程开始</dt>
        <dd class="col-8">{{info.goFlightEffectDate}}</dd>
        <dt class="col-4 text-right">去程截止</dt>
        <dd class="col-8">{{info.goFlightExpiryDate}}</dd>
        <dt class="col-4 text-right">去程舱位</dt>
        <dd class="col-8">{{info.goSubClass}}</dd>
        <dt class="col-4 text-right">去程航班</dt>
        <dd class="col-8">{{info.goFlightNo}}</dd>
        <dt class="col-4 text-right">销售开始</dt>
        <dd class="col-8">{{info.effectDate}}</dd>
        <dt class="col-4 text-right">销售截止</dt>
        <dd class="col-8">{{info.expiryDate}}</dd>
        <dt class="col-4 text-right">有效</dt>
        <dd class="col-8">{{info.isValid}}</dd>
        <dt class="col-4 text-right">结算价</dt>
        <dd class="col-8">{{info.setPrice}}</dd>
        <dt class="col-4 text-right">监控</dt>
        <dd class="col-8">{{info.monitoring}}</dd>
        <dt class="col-4 text-right">监控时间</dt>
        <dd class="col-8">{{info.monitorTime}}</dd>
        <dt class="col-4 text-right">备注</dt>
        <dd class="col-8">{{info.remark}}</dd>
      </dl>
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
import { searchSpecialPolicyDetail } from '../api/ctrp.js'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      loading: false,
      loadingText: '数据加载中',

      info: null
    }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined) {
      // console.log(id)
      this.refreshDetail(parseInt(id))
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    refreshDetail: function (id) {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      searchSpecialPolicyDetail(id,
        (jsonResult) => {
          self.info = jsonResult
        },
        null,
        () => {
          this.loading = false
        }
      )
    }
  }
}
</script>
