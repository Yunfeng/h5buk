<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        修改线路 <small>id: {{id}}</small>
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>线路名称</td>
          <td><input class="weui-input" placeholder="线路名称" v-model="tripName"></td>
        </tr>
        <tr>
          <td>出发地</td>
          <td><input class="weui-input" placeholder="出发地" v-model="tripFrom"></td>
        </tr>
        <tr>
          <td>目的地</td>
          <td><input class="weui-input" placeholder="目的地" v-model="tripTo"></td>
        </tr>
        <tr>
          <td>购买链接</td>
          <td><input class="weui-input" placeholder="购买链接" v-model="buyUrl"></td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td><input class="weui-input" placeholder="联系方式" v-model="buyContact"></td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td>{{formatDateTime(createTime)}}</td>
        </tr>
        <tr>
          <td>上次修改时间</td>
          <td>{{formatDateTime(lastupdate)}}</td>
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
        <button class="weui-btn weui-btn_primary" @click="saveTrip()">保存</button>
      </div>
    </div>

  </div>
</template>

<script>
import { createTrip, getTripDetail } from '../../api/trip.js'
import { convertLongToTimeDesc } from '../../common/common.js'
import UM from 'UM'

export default {
  data () {
    return {
      id: 0,
      tripName: '',
      tripFrom: '',
      tripTo: '',
      tripContent: '',
      buyUrl: '',
      buyContact: '',

      createTime: null,
      lastupdate: null,

      editor: null
    }
  },
  mounted: function () {
    window.UMEDITOR_HOME_URL = '/ueditor/'
    this.editor = UM.getEditor('myEditor')

    var id = this.$route.params.id
    if (id !== undefined) {
      this.id = parseInt(id)
      this.init()
    }
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
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    reset: function () {
      this.id = 0
      this.tripName = ''
      this.tripFrom = ''
      this.tripTo = ''
      this.tripContent = ''
      this.buyUrl = ''
      this.buyContact = ''
    },
    init: function () {
      this.showLoading()

      getTripDetail(this.id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === this.id) {
            this.tripName = jsonResult.name
            this.tripFrom = jsonResult.dcity
            this.tripTo = jsonResult.acity
            this.buyUrl = jsonResult.buyUrl
            this.buyContact = jsonResult.buyContact

            this.tripContent = jsonResult.content
            this.editor.setContent(this.tripContent, true)

            this.createTime = jsonResult.createTime
            this.lastupdate = jsonResult.lastupdate
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    saveTrip: function () {
      var params = {
        'id': this.id,
        'name': this.tripName,
        'from': this.tripFrom,
        'to': this.tripTo,
        'content': this.editor.getContent(),
        'buyUrl': this.buyUrl,
        'buyContact': this.buyContact
      }

      this.showLoading()

      createTrip(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.$router.replace('/trip/' + jsonResult.returnCode)
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
