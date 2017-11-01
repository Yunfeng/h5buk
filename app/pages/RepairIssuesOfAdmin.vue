<template>
	<div class="row px-0">
    <div class="card col-12 border-0">
      <div class="card-header text-center bg-info text-white">
        工单处理
      </div>
    </div>
    <div class="col-3">
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
          <table class="table table-striped table-sm">
            <thead>
              <tr>
                <th class="text-center">报修内容</th>
                <th class="text-center">报修时间</th>
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="info in dataList" @click.stop="showIssueDetail(info)">
                <td>
                  <template v-if="info.status === 2">
                    <del>{{getShortDesc(info.content)}}</del>
                  </template>
                  <template v-else>
                    {{getShortDesc(info.content)}}    
                  </template>                
                </td>
                <td class="small text-center">{{formatTime(info.createTime)}}</td>
                <td> > </td>
              </tr>
            </tbody>
          </table>
          
        </template>
      </div>
    </div>
    <div class="col-9">
      <template v-if="detail !== null">
        <div class="card col-12">
          <div class="card-body text-center">
            <strong>报修内容</strong><br />
            {{detail.content}}
            <br />
            <span class="small float-right">报修时间：{{formatTime(detail.createTime)}}</span>

          </div>
          <template v-if="urls.length > 0">
            <div class="card-body">
              <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">              
                  <li data-target="#carouselExampleIndicators" :data-slide-to="index" :class="{ active: index === 0 }"  v-for="(info, index) in urls"></li>
                </ol>
                <div class="carousel-inner">
                  <div class="carousel-item" :class="{ active: index === 0 }"  v-for="(info, index) in urls">
                    <img class="d-block w-100" :src="info" style="max-height: 50rem; ">
                  </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div> 
            </div>
          </template>          

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
  </div>
</template>

<script>
import { convertLongToTimeDesc } from '../common/common.js'
import $ from 'jquery'

export default {
  name: 'repairIssueAdmin',
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
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
