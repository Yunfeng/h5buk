<template>
	<div id="order-detail" class="row">
    <template v-if="info !== null">
      <div class="col-12 bg-info text-center text-white sticky-top">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left"aria-hidden="true"></i>
          <small>返回</small>
        </span>
        <span class="fa-2">改期单详情</span> <small>单号:{{info.id}}</small>
      </div> 
      <div class="card col-12">
        <dl class="row mt-2">
          <dt class="col-4 text-right px-0">票号</dt>
          <dd class="col-8">
            {{info.ticketNo}}
          </dd>
          <dt class="col-4 text-right px-0">乘机人</dt>
          <dd class="col-8">
            {{info.psgName}}
          </dd>
          <dt class="col-4 text-right px-0">改期内容</dt>
          <dd class="col-8">
            {{info.reason}}
          </dd>
          <dt class="col-4 text-right px-0">备注</dt>
          <dd class="col-8">
            {{info.remark}}
          </dd>
          <dt class="col-4 text-right px-0">状态</dt>
          <dd class="col-8">
            {{showStatusDesc(info.status)}}
          </dd>
        </dl>
      </div>
    </template> 
  </div>
</template>

<script>
import { showChangeOrderStatus } from '../common/common.js'
import { searchChangeOrderDetail } from '../api/order.js'

export default {
  computed: {
    info () { return this.$store.state.changeOrderInfo }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined && this.info === null) {
      this.refreshChangeOrderDetail(parseInt(id))
    }
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
    showStatusDesc: function (status) {
      return showChangeOrderStatus(status)
    },
    refreshChangeOrderDetail: function (id) {
      var self = this

      self.showLoading('改期单查询中...')
      console.log(id)
      searchChangeOrderDetail(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            self.$store.commit('setChangeOrderInfo', jsonResult)
          }
        },
        (status, statusText) => { this.showErrMsg(status + ', ' + statusText, 'danger') },
        () => self.hideLoading()
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      window.scroll(0, 0)
    })
  }
}
</script>
