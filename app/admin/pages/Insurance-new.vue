<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        保险
    </div>

        <div class="card col-12 p-0">
      <div class="card-block">
        <form>
          <label  class="mb-0">产品代码(不可重复）</label>
          <div class="input-group mb-2">
            <span class="input-group-addon text-danger">10</span>
            <input type="text" class="form-control"  v-model="code">
          </div>
          <label  class="mb-0">产品名称(可重复，方便记忆)</label>
          <div class="input-group mb-2">
            <input type="text" class="form-control"  v-model="name">
          </div>
          <label  class="mb-0">产品描述</label>
          <div class="input-group mb-2">
            <input type="text" class="form-control"  v-model="remark">
          </div>
          <label  class="mb-0">价格（元）</label>
          <div class="input-group mb-2">
            <input type="text" class="form-control"  v-model.number="price">
          </div>
          <label  class="mb-0">折扣（元）</label>
          <div class="input-group mb-2">
            <input type="text" class="form-control"  v-model.number="discount">
          </div>

        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-success btn-block" type="button" @click.stop="create()">创建</button>
      </div>
    </div>


  </div>
</template>

<script>
import { createInsurance } from '../../api/product.js'

export default {
  data () {
    return {
      id: 0,
      code: '',
      name: '',
      remark: '',
      price: 0,
      discount: 0
    }
  },
  mounted: function () {
  },
  destroyed () {
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
    create: function () {
      var params = {
        'productCode': '10' + this.code,
        'productName': this.name,
        'productDesc': this.remark,
        'price': this.price,
        'discount': this.discount
      }

      this.showLoading()

      createInsurance(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.reset()
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    reset: function () {
      this.id = 0
      this.code = ''
      this.name = ''
      this.remark = ''
      this.price = 0
      this.discount = 0
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
