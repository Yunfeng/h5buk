<template>  
	<div id="ctrp-sync" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 fixed-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      政策同步
    </div> 

    <div class="card col-12 mt-4">
      <div class="form-group row mt-2">
        <label class="col-3 col-form-label text-right">航司</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="航空公司" size="2" v-model="carrier">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-3 col-form-label text-right">舱位</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="舱位"  name="sc.subclass"  size="3" v-model="subclass">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-3 col-form-label text-right">出发</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="出发机场" name="sc.departureAirport" size="6" v-model="dport">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-3 col-form-label text-right">到达</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="到达机场"  name="sc.arrivalAirport" size="6" v-model="aport">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-3 col-form-label text-right">政策</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="政策代码"  name="sc.policyCode" v-model="policyCode">
        </div>
      </div>
      <div class="form-group row">
        <div class="col-12 text-center bg-faded">
          <button @click.stop="syncPolicy()" class="btn btn-success btn-block text-center">同步特殊政策</button> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { syncSpecialPolicy } from '../api/ctrp.js'

export default {
  data () {
    return {
      carrier: '',
      subclass: '',
      dport: '',
      aport: '',
      policyCode: ''
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
    syncPolicy: function () {
      var self = this
      self.showLoading()

      var params = { 'sc.subclass': this.subclass,
        'sc.departureAirport': this.dport,
        'sc.arrivalAirport': this.aport,
        'sc.policyCode': this.policyCode,
        'sc.carrier': this.carrier
      }

      syncSpecialPolicy(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg(jsonResult.desc, 'success')
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        (errcode, errmsg) => { this.showErrMsg(errcode + ' ' + errmsg, 'danger') },
        () => { this.hideLoading() })
    }
  }
}
</script>
