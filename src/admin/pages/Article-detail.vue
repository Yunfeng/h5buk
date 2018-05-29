<template>  
	<div id="article-detail" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      文章内容
    </div>

    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title text-center">{{detail.title}}</h4>          
        </div>       
        <span class="bg-faded text-center text-muted">&nbsp;</span>
        <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">摘要: {{detail.digest}}</li>
          <li class="list-group-item">封面图片素材id: {{detail.thumbMediaId}}</li>
          <li class="list-group-item">创建时间: {{formatDateTime(detail.createTime)}}</li>
          <li class="list-group-item">修改时间: {{formatDateTime(detail.lastupdate)}}</li>
        </ul>
        <div class="card-footer">
          <button class="btn btn-block btn-primary" @click.stop="edit(detail.id)">修改</button>
          <button class="btn btn-block btn-danger" @click.stop="deleteArt(detail.id, detail.title)">删除</button>  
          <button class="btn btn-block btn-warning mt-3" @click.stop="uploadToWx(detail.id)">上传为微信图文素材</button>  
        </div>
      </div>
    </template>     
  </div>
</template>

<script>
import { refreshArticle, deleteArticle, uploadArticleToWx } from '../../api/article.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  name: 'article-detail',
  data () {
    return {
      detail: null
    }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined) {
      this.refreshArticle(parseInt(id))
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
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    edit: function () {
      this.$router.push('/art/edit/' + this.detail.id)
    },
    refreshArticle: function (id) {
      this.showLoading()

      refreshArticle(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.detail = jsonResult
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    deleteArt: function (id, title) {
      if (window.confirm('确定删除文章 ' + title + ' 吗？') === false) {
        return
      }

      this.showLoading('删除中......')

      deleteArticle(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg(title + ' 已删除')
            this.$router.replace('/arts')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    uploadToWx: function (id) {
      this.showLoading('处理中......')

      uploadArticleToWx(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('media_id is ' + jsonResult.desc)
          } else {
            this.showErrMsg('出了点问题')
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
      window.scroll(0, 0)
    })
  }
}
</script>
