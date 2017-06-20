<template>  
	<div id="trip-day-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        录入每日行程
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>第几天</td>
          <td><input class="weui-input" placeholder="第几天" v-model.number="day"></td>
        </tr>
        <tr>
          <td>标题</td>
          <td><input class="weui-input" placeholder="标题" v-model="title"></td>
        </tr>
        <tr>
          <td colspan="2">内容</td>
        </tr>
        <tr>
          <td colspan="2">
            <script type="text/plain" id="myEditor" class="col-12">    
            </script>
          </td>
        </tr>
      </table>

      <div class="card-footer">
        <button class="weui-btn weui-btn_primary" @click="createTrip()">创建</button>
      </div>
    </div>

  </div>
</template>

<script>
import { createTripDay } from '../../api/trip.js'
import UE from 'UE'

export default {
  data () {
    return {
      tripId: 0,
      day: 0,
      title: '',
      content: '',

      editor: null
    }
  },
  mounted: function () {
    window.UMEDITOR_HOME_URL = '/ueditor/'
    this.editor = UE.getEditor('myEditor')

    this.tripId = this.$route.params.id
  },
  destroyed () {
    this.editor.destroy()
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
    createTrip: function () {
      var params = {
        'tripId': this.tripId,
        'day': this.day,
        'title': this.title,
        'content': this.editor.getContent()
      }

      this.showLoading()

      createTripDay(params,
        (jsonResult) => {
          console.log(jsonResult)
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.$router.replace('/trip/' + this.tripId)
            // this.reset()
          } else {
            this.showErrMsg('操作失败: ' + jsonResult.errmsg, 'danger')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    reset: function () {
      this.day = 0
      this.content = ''
    }

  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
