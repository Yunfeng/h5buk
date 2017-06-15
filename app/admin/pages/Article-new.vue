<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
      <template v-if="id ===0">
        录入新文章
      </template>
      <template v-else>
        修改文章 <small>id: {{id}}</small>
      </template>
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>标题</td>
          <td><input class="weui-input" placeholder="文章标题" v-model="title"></td>
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
        <tr>
          <td colspan="2">
            <button data-toggle="modal" data-target="#selectMaterialModal">插入图片</button>
          </td>
        </tr>
      </table>

      <div class="card-footer">
        <button class="weui-btn weui-btn_primary" @click="saveNewArticle()">保存</button>
      </div>
    </div>

    <div class="modal fade" id="selectMaterialModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">请选择素材</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body row">
            <template v-for="(info, index) in dataList">
              <div class="media m-2">
                <img class="d-flex m-1" :src="addImgPrefix(info.key)" style="height: 5rem; width: 5rem;">
                <div class="media-body">
                  <button class="btn btn-info btn-sm" @click.stop="addImgToDetail(info.key)">选择</button>
                </div>
              </div>  
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import UM from 'UM'
import { createArticle, refreshArticle, updateArticle } from '../../api/article.js'
import { searchMaterials } from '../../api/material.js'

export default {
  data () {
    return {
      id: 0,
      title: '',
      content: '',

      editor: null,

      detail: null,

      imgTo: 0,
      dataList: []
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

    this.searchMaterials()
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
    reset: function () {
      this.title = ''
      this.content = ''

      this.imgs = []
    },
    searchMaterials: function () {
      this.showLoading()
      const params = { 'sc.pageNo': 1,
        'sc.pageSize': 100
      }

      searchMaterials(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          // self.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
    },
    init: function () {
      refreshArticle(this.id,
        (jsonResult) => {
          this.title = jsonResult.title
          this.content = jsonResult.content
          this.editor.setContent(this.content, true)
        },
        null,
        () => {}
      )
    },
    saveNewArticle: function () {
      var params = {
        'id': this.id,
        'title': this.title,
        'content': this.editor.getContent()
      }

      this.showLoading('保存中......')

      if (this.id === 0) {
        createArticle(params,
          (jsonResult) => {
            if (jsonResult.status === 'OK') {
              this.showErrMsg('OK')
              this.$router.replace('/art/' + jsonResult.returnCode)
            } else {
              this.showErrMsg(jsonResult.errmsg, 'danger')
            }
          },
          () => {},
          () => { this.hideLoading() }
        )
      } else {
        updateArticle(params,
          (jsonResult) => {
            if (jsonResult.status === 'OK') {
              this.showErrMsg('OK')
              this.$router.replace('/art/' + this.id)
            } else {
              this.showErrMsg(jsonResult.errmsg, 'danger')
            }
          },
          () => {},
          () => { this.hideLoading() }
        )
      }
    },
    addImgPrefix: function (url) {
      return 'http://video.90sky.com/' + url
    },
    addImgToDetail: function (key) {
      const url = this.addImgPrefix(key)

      if (this.imgTo === 0) {
        var content = '<p class="text-center"><img src="' + url + '"  class="img-fluid"> </p>'
        // this.editor.setContent(content, true)
        this.editor.execCommand('insertHtml', content)
      } else if (this.imgTo === 1) {
        this.saveVegImgInfo(url)
      }

      this.imgTo = 0
      $('#selectMaterialModal').modal('hide')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
