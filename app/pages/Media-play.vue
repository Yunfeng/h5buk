<template>
	<div id="player" class="row">
    <div class="card col-12 bg-info">
      <template v-if="mediaInfo">
        <div class="card-block px-0">
          <video id="media" :src="videoUrl" width="100%" controls="controls" autoplay="autoplay">您的浏览器不支持播放此视频!</video>
        </div>
        <div class="card-block text-white px-0">
          <blockquote class="blockquote">
            <p class="mb-0">{{remark}}</p>
            <footer class="blockquote-footer"><span class="float-right small">{{formatTime(createTime).substring(0, 16)}}</span> 播放 {{playCount}} </footer>
          </blockquote>
        </div>
        <div class="card-block bg-success text-white" v-if="isAdmin">
          <div class="form-group">
            <label>标题</label>
            <input type="text" class="form-control" v-model="title1">
            <small class="form-text text-muted">标题</small>
          </div>
          <div class="form-group">
            <label for="exampleTextarea">内容介绍</label>
            <textarea class="form-control" rows="3" v-model="remark1"></textarea>
          </div>

          <button type="button" class="btn btn-primary" @click.stop="updateMediaInfo()">保存</button>
        </div>
      </template>
    </div>  
         
  </div>
</template>

<script>
import { convertLongToTimeDesc } from '../common/common.js'
import { searchMediaName, saveMediaPlayStatus, isMediaAdmin, updateMediaInfo } from '../api/material.js'
import { initJsSdkParam } from '../api/wx.js'
import $ from 'jquery'
import wx from 'wx'

export default {
  name: 'media-play',
  data () {
    return {
      mediaInfo: null,
      isAdmin: false,
      title1: '',
      remark1: ''
    }
  },
  computed: {
    videoUrl () { return 'http://video.90sky.com/' + this.fileName },
    title () { return this.mediaInfo.title },
    remark () { return this.mediaInfo.remark },
    playCount () { return this.mediaInfo.playCount },
    fileName () { return this.mediaInfo.key },
    createTime () { return this.mediaInfo.createTime },
    mediaId () { return this.mediaInfo.id }
  },
  updated: function () {
    var self = this
    if (this.mediaInfo !== null) {
      $('#media').bind('play', function (e) {
        self.beginPlay(self.mediaInfo.id)
      }).bind('ended', function (e) {
        self.endPlay(self.mediaInfo.id)
      })
    }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined) {
      this.searchMediaName(parseInt(id))
    }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    initWxJsSdk: function () {
      var self = this
      var url = window.location.href.split('#')[0]
      initJsSdkParam(url,
        (param) => {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: param.appId, // 必填，公众号的唯一标识
            timestamp: param.timestamp, // 必填，生成签名的时间戳
            nonceStr: param.nonceStr, // 必填，生成签名的随机串
            signature: param.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
          wx.ready(function () {
            // console.log('wx is ready')
          })
          wx.error(function (res) {
            // console.log('wx.error: ' + res.errMsg)
          })
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: self.title, // 分享标题
            link: 'http://b2c.90sky.com/?to=play&id=' + self.mediaId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://video.90sky.com/' + self.fileName + '.thumbnail.jpg', // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          })

          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: self.title, // 分享标题
            desc: self.remark, // 分享描述
            link: 'http://b2c.90sky.com/?to=play&id=' + self.mediaId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://video.90sky.com/' + self.fileName + '.thumbnail.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          })
        }
      )
    },
    searchMediaName: function (id) {
      searchMediaName(id,
        (jsonResult) => {
          this.mediaInfo = jsonResult

          this.initWxJsSdk()

          if (this.title != null) {
            window.document.title = this.title
          }

          this.title1 = this.title
          this.remark1 = this.remark

          this.isMediaAdmin(id)
        },
        null,
        null
      )
    },
    beginPlay: function (id) {
      // console.log('begin play: ' + id)
      saveMediaPlayStatus(id, 'begin')
    },
    endPlay: function (id) {
      // console.log('end play: ' + id)
      saveMediaPlayStatus(id, 'end')
    },
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    },
    isMediaAdmin: function (id) {
      isMediaAdmin(id,
        (jsonResult) => { this.isAdmin = jsonResult.status === 'OK' }
      )
    },
    updateMediaInfo: function () {
      var params = { 'id': this.mediaId,
        'title': this.title1,
        'remark': this.remark1
      }
      updateMediaInfo(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('修改成功')
            this.searchMediaName(this.mediaId)
          }
        }
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
