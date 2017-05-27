<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
      <template v-if="id ===0">
        录入新线路计划
      </template>
      <template v-else>
        修改文章 <small>id: {{id}}</small>
      </template>
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
import { createTrip } from '../../api/trip.js'
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
    search: function () {
      // if (this.dataList.size > 0) return

      // var self = this
      // self.loading = true
      // self.loadingText = '数据加载中'

      // $.ajax({
      //   type: 'post',
      //   url: '/Flight/material/list',
      //   dataType: 'json',
      //   success: function (jsonResult) {
      //     self.loading = false
      //     if (jsonResult.count > 0) {
      //       self.$store.commit('setMaterials', jsonResult.dataList)
      //     }
      //   },
      //   error: function (XMLHttpRequest, textStatus, errorThrown) {
      //     self.searching = false

      //     if (XMLHttpRequest.status === 403) {
      //       self.$store.commit('jumpToLogin', self.$router)
      //     }
      //   },
      //   complete: function (XMLHttpRequest, textStatus) {
      //     self.loading = false
      //   }
      // })
    },
    init: function () {
      // var detail = this.$store.state.articleDetail
      // if (detail === null) {
      //   refreshArticle(this.id,
      //     (jsonResult) => {
      //       this.title = jsonResult.title
      //       this.content = jsonResult.content
      //       this.editor.setContent(this.content, true)
      //     },
      //     null,
      //     () => {}
      //   )
      // } else {
      //   this.title = detail.title
      //   this.content = detail.content
      //   this.editor.setContent(this.content, true)
      // }
    },
    createTrip: function () {
      var params = {
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
    },
    reset: function () {
      this.id = 0
      this.tripName = ''
      this.tripFrom = ''
      this.tripTo = ''
      this.tripContent = ''
      this.buyUrl = ''
      this.buyContact = ''

      this.editor.setContent(this.tripContent, true)
    }

  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
