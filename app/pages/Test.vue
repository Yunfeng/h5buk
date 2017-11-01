<template>
	<div class="row px-0">
    <div class="card col-12 border-0">
      <div class="card-header text-center bg-info text-white">
        工单        
      </div>
    </div>
    <template v-if="showMode === 0">
      <div class="card col-12 mt-1 mb-1 border-0">
        <div class="card-body">
          <button class="btn btn-success float-right mr-2" @click.stop="search()">刷新</button>
        </div>
      </div>
      <div class="card col-12">
        <template v-if="dataList.length == 0">
          <div class="card-body text-center text-white">
            没有在处理的报修工单！
          </div>      
        </template>
        <template v-else>
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="text-center">报修内容</th>
                <th class="text-center">报修时间</th>
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="info in dataList" @click.stop="showIssueDetail(info)">
                <td>{{getShortDesc(info.content)}}</td>
                <td class="small text-center">{{formatTime(info.createTime)}}</td>
                <td> > </td>
              </tr>
            </tbody>
          </table>
          
        </template>
        <div class="card-footer text-center mt-5">
          <button class="btn btn-warning" @click.stop="createRepair()">我要报修</button>
        </div>
      </div>
    </template>
    <template v-if="showMode === 1">
      <div class="card col-12">
        <div class="card-body">
          <template v-for="(info, index) in imgs">
            <img :src="info" class="img-thumbnail">
            <button @click.stop="deleteImage(index)" class="btn btn-danger btn-sm float-right">删除</button>
          </template>
          <div class="d-flex justify-content-around mt-3">
            <button @click.stop="chooseImage()" class="btn btn-primary">添加照片</button>
          </div>
        </div>
        
        <div class="card-body">
          <div class="form-group">
            <label for="exampleTextarea">报修内容</label>
            <textarea class="form-control" rows="5" v-model.trim="content"></textarea>
          </div>
        </div>
        
        <div class="card-footer text-center">
          <button type="button" class="btn btn-success" @click.stop="save()">提交报修</button>
        </div>
      </div>
    </template>
    <template v-if="showMode === 2 && detail !== null">
      <div class="card col-12">
        <div class="card-header">
          <button class="btn btn-primary" @click.stop="closeDetail()">返回</button>
        </div>
        <div class="card-body">
          <strong>报修内容</strong>：{{detail.content}}<br />
          <span class="small">报修时间：{{formatTime(detail.createTime)}}</span>

          <template v-if="this.urls.length > 0">
            <button class="btn btn-info float-right mr-2" @click.stop="previewImage()">查看图片</button>  
          </template>          
        </div>

        <template v-if="detail.logs !== null && detail.logs.length > 0">
          <table class="table table-striped">
            <tbody>
              <tr v-for="logInfo in detail.logs">
                <td>
                  <span v-if="logInfo.clientComment != null">Q: {{logInfo.clientComment}}</span>
                  <span v-if="logInfo.memo != null" class="float-right">A: {{logInfo.memo}}</span>
                </td>
              </tr>              
            </tbody>
          </table>
        </template>

        <div class="card-body" v-if="detail.status === 0">
          <div class="form-group">
            <label>补充内容</label>
            <textarea class="form-control" rows="5" v-model.trim="moreContent"></textarea>
          </div>
          <div class="form-group text-center">
            <button type="button" class="btn btn-success" @click.stop="saveMoreContent()">提交</button>
          </div>
        </div>
        
        <div class="card-footer text-right mt-5" v-if="detail.status === 0">
          <button class="btn btn-danger" @click.stop="closeIssue()">关闭工单</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { convertLongToTimeDesc } from '../common/common.js'
import { initJsSdkParam } from '../api/wx.js'
import wx from 'wx'
import $ from 'jquery'

export default {
  name: 'test',
  data () {
    return {
      dataList: [],
      showMode: 0,
      content: '',
      moreContent: '',
      imgs: [],
      mediaIds: [],

      detail: null,

      newImgs: [],

      urls: [],
      current: ''
    }
  },
  mounted: function () {
    this.$store.commit('hideBottomTabBar')

    this.initWxJsSdk()
    this.search()
  },
  beforeDestroy: function () {
    this.$store.commit('showBottomTabBar')
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
      const self = this
      this.showLoading()

      $.ajax({
        type: 'post',
        url: '/Flight/repair/issues',
        dataType: 'json'
      }).done(function (jsonResult) {
        self.dataList = jsonResult.dataList
      }).always(function () {
        self.hideLoading()
      })
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
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay', 'chooseImage', 'previewImage', 'uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
          wx.ready(function () {
            // console.log('wx is ready')
            self.remark += 'wx is ready\r'
          })
          wx.error(function (res) {
            // console.log('wx.error: ' + res.errMsg)
          })
        }
      )
    },
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    },
    getShortDesc: function (val) {
      if (val.length > 20) {
        return val.substring(0, 20) + '...'
      } else {
        return val
      }
    },
    showIssueDetail: function (info) {
      this.detail = info
      this.showMode = 2

      this.urls.splice(0)

      const length = this.detail.images.length

      for (let i = 0; i < length; i++) {
        if (this.detail.images[i].url !== null) {
          this.urls.push(this.detail.images[i].url)
        }
      }
    },
    chooseImage: function () {
      const self = this
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          self.newImgs = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          self.showImage()
        }
      })
    },
    showImage: function () {
      for (let i = 0; i < this.newImgs.length; i++) {
        this.imgs.push(this.newImgs[i])
      }
    },
    deleteImage: function (index) {
      this.imgs.splice(index, 1)
    },
    createRepair: function () {
      this.showMode = 1
      this.imgs.splice(0)
    },
    save: function () {
      const self = this

      if (this.content.length < 5) {
        this.showErrMsg('内容的字符不能少于5个字', 'warning')
        return
      }

      // 保存时先将本地图片调用接口上传到服务器
      // self.showErrMsg('wx.uploadImage')
      let i = 0
      const length = this.imgs.length

      this.mediaIds = []

      function upload () {
        wx.uploadImage({
          localId: self.imgs[i], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            i++
            self.showErrMsg('已上传：' + i + '/' + length)

            self.mediaIds.push(res.serverId) // 返回图片的服务器端ID
            if (i < length) {
              upload()
            } else if (i === length) {
              self.doSave()
            }
          },
          fail: function (res) {
            self.showErrMsg(JSON.stringify(res))
          }
        })
      }
      if (length > 0) {
        upload()
      } else {
        this.doSave()
      }
    },
    doSave: function () {
      // 保存content 和 mediaIds
      const self = this
      const params = {
        'content': this.content,
        'mediaIds': this.mediaIds.join(',')
      }

      this.showLoading('保存中...')

      $.ajax({
        type: 'post',
        url: '/Flight/repair/create',
        data: params,
        dataType: 'json'
      }).done(function (jsonResult) {
        if (jsonResult.status === 'OK') {
          self.showErrMsg('保存成功')
          self.content = ''
          self.mediaIds = []
          self.imgs = []
          self.showMode = 0
          // 刷新结果
          self.search()
        } else {
          self.showErrMsg('保存失败')
        }
      }).always(function () {
        self.hideLoading()
      })
    },
    saveMoreContent: function () {
      if (this.moreContent.length < 10) {
        this.showErrMsg('补充内容不能少于10个字', 'warning')
        return
      }

      const self = this
      const params = {
        'issueId': this.detail.id,
        'content': this.moreContent
      }

      this.showLoading('保存中...')

      $.ajax({
        type: 'post',
        url: '/Flight/repair/issue/comment',
        data: params,
        dataType: 'json'
      }).done(function (jsonResult) {
        self.showErrMsg('保存完毕')
        self.moreContent = ''
        self.detail.logs = jsonResult
      }).always(function () {
        self.hideLoading()
      })
    },
    closeIssue: function () {
      // 关闭当前工单
      const self = this
      const params = {
        'issueId': this.detail.id
      }

      this.showLoading('关闭中...')

      $.ajax({
        type: 'post',
        url: '/Flight/repair/issue/close',
        data: params,
        dataType: 'json'
      }).done(function (jsonResult) {
        if (jsonResult.status === 'OK') {
          self.showErrMsg('工单已关闭')
          self.showMode = 0
          self.search()
        } else {
          self.showErrMsg('工单关闭操作未完成')
        }
      }).always(function () {
        self.hideLoading()
      })
    },
    closeDetail: function () {
      this.showMode = 0
    },
    previewImage: function () {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: this.urls // 需要预览的图片http链接列表
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
