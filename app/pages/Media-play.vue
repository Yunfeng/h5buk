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
import $ from 'jquery'

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
    createTime () { return this.mediaInfo.createTime }
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
  },
  methods: {
    back: function () {
      this.$router.go(-1)
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
