<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-info text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        设置
    </div>

    <div class="card col-12">
      <div class="card-block">
        <div class="form-group">
            <label class="control-label">工作日安排</label>
            <input type="textfield" class="form-control" v-model="workDay" />
            <span class="help-block">格式：12345 表示周一到周五上班, 1234567 表示天天上班</span>
        </div>
        <div class="form-group">
            <label class="control-label">上班时间</label>
            <input type="textfield" class="form-control" v-model="workBeginTime" />
            <span class="help-block">时间格式：0830</span>
        </div>
        <div class="form-group">
            <label class="control-label">下班时间</label>
            <input type="textfield" class="form-control" v-model="workEndTime" />          
            <span class="help-block">时间格式：2200</span>
        </div>
        <div class="form-group">
            <label class="control-label">收款账号</label>
            <input type="textfield" class="form-control" v-model="receivingAccount" />          
            <span class="help-block">设置一次，以后将不能修改</span>
        </div>
        <div class="form-group">
            <label class="control-label">机票服务费</label>
            <input type="textfield" class="form-control" v-model.number="flightServiceFee" />          
            <span class="help-block">公众号中显示的机票舱位价格包含此服务费</span>
        </div>
        <div class="form-group">
            <button v-on:click.stop="save();" class="btn btn-success btn-block">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { convertLongToTimeDesc } from '../../common/common.js'
import { searchEntConfig, saveEntConfig } from '../../api/admin.js'

export default {
  data () {
    return {
      workDay: '',
      workBeginTime: '',
      workEndTime: '',
      receivingAccount: '',
      flightServiceFee: 0
    }
  },
  mounted: function () {
    this.search()
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
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    search: function () {
      this.showLoading()

      searchEntConfig(
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === this.id) {
            this.workDay = jsonResult.workDay
            this.workBeginTime = jsonResult.workBeginTime
            this.workEndTime = jsonResult.workEndTime
            this.receivingAccount = jsonResult.receivingAccount
            this.flightServiceFee = jsonResult.flightServiceFee
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    save: function () {
      var params = { 'workDay': this.workDay,
        'workBeginTime': this.workBeginTime,
        'workEndTime': this.workEndTime,
        'receivingAccount': this.receivingAccount,
        'flightServiceFee': this.flightServiceFee
      }

      this.showLoading()

      saveEntConfig(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('保存成功')
            this.search()
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
