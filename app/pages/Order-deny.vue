<template>  
	<div id="order-deny" class="row">
    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>

    <div class="card col-12 border-0">
      <div class="card-header text-center">拒单理由</div>
      <div class="card-block">
        <div class="form-group row">
          <label class="col-4 col-form-label text-right">理由类别</label>
          <div class="col-8">
            <select class="form-control" v-model="denyCode">
              <option value="401">价格少算</option>
              <option value="402">外放无位，请授权</option>
              <option value="499">其它</option>
            </select>
            <span class="form-text text-muted">
              <small>请准确选择</small>
            </span>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">理由说明</label>
          <div class="col-8">
            <input type="text" class="form-control" placeholder="拒绝理由详细说明" v-model="denyReason" />
            <span class="form-text text-muted">
              <small>必填，不多于50字</small>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class='card col-12 border-0 mb-2'>
      <button type='button' class='btn btn-success w-100' @click.stop='denyOrder()'>确定</button>
      <button type='button' class='btn btn-outline-danger w-100 mt-3' @click.stop='close()'>取消</button>
    </div>
    
  </div>
</template>

<script>
import MyInput from '../components/my-input.vue'

import $ from 'jquery'

export default {
  components: {
    'my-input': MyInput
  },
  data () {
    return {
      loading: false,
      loadingText: '数据加载中',

      denyCode: 401,
      denyReason: ''
    }
  },
  computed: {
    info () { return this.$store.state.orderDetail },
    orderId () { return this.$store.state.orderId }
  },
  mounted: function () {
    // this.search()
  },
  methods: {
    close: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg) {
      this.$store.commit('showAlertMsg', msg)
    },
    denyOrder: function () {
      // 卖家：拒单
      var url = '/Flight/orders/denyTmcOrder.do'
      var postData = {
        'id': this.orderId,
        'denyCode': this.denyCode,
        'denyReason': this.denyReason
      }
      var successHandler = this.close

      this.executeOrderOp(url, postData, successHandler)
    },
    executeOrderOp: function (url, postData, successHandler) {
      var self = this

      self.loading = true
      self.loadingText = '处理中......'

      var opResult = false

      $.ajax({
        type: 'post',
        url: url,
        data: postData,
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.showErrMsg('操作成功')
            opResult = true
          } else {
            self.showErrMsg('操作失败： ' + jsonResult.errmsg)
          }
        },
        complete: function () {
          self.loading = false
          if (opResult) {
            successHandler()
          }
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
