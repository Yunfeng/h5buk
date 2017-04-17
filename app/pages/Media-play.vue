<template>
	<div id="material-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click='back()' class="float-left">
        <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        <small>返回</small>
      </span>
      媒体播放
    </div> 
    <div class="card col-12 px-0">
      <template v-if="mediaInfo">
        <video id="media" :src="videoUrl" width="100%" controls="controls" autoplay="autoplay">您的浏览器不支持播放此视频!</video>
        <div class="card-block">
          文件名: {{key}} <br />
          创建日期：{{formatTime(createTime)}}
        </div>
      </template>
    </div>  
         
  </div>
</template>

<script>
import { convertLongToTimeDesc } from '../common/common.js'
import { searchMediaName, saveMediaPlayStatus } from '../api/material.js'
import { initJsSdkParam } from '../api/wx.js'
import $ from 'jquery'
import wx from 'wx'

export default {
  name: 'media-play',
  data () {
    return {
      mediaInfo: null,
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      }
    }
  },
  computed: {
    videoUrl () { return 'http://video.90sky.com/' + this.key },
    key () { return this.mediaInfo.key },
    createTime () { return this.mediaInfo.createTime },
    mediaId () { return this.mediaInfo.id }
  },
  updated: function () {
    var self = this
    // window.console.log('updated')
    if (this.mediaInfo === null) {
      window.console.log('this.mediaInfo is null')
    } else {
      // window.console.log('this.mediaInfo is ok')
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

    window.console.log('mounted')
    if (this.mediaInfo === null) {
      window.console.log('mounted this.mediaInfo is null')
    } else {
      window.console.log('mounted this.mediaInfo is ok')
    }

    this.initWxJsSdk()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
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
            console.log('wx is ready')
          })
          wx.error(function (res) {
            console.log('wx.error: ' + res.errMsg)
          })
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: self.key, // 分享标题
            link: 'http://b2c.90sky.com/?to=play&id=' + this.mediaId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://video.90sky.com/' + self.key + '.thumbnail.jpg', // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          })

          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: self.key, // 分享标题
            desc: '分享', // 分享描述
            link: 'http://b2c.90sky.com/?to=play&id=' + this.mediaId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://video.90sky.com/' + self.key + '.thumbnail.jpg', // 分享图标
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
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
