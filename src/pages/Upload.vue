<template>
  <div id="upload" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click='back()' class="float-left">
        <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        <small>返回</small>
      </span>
      上传
    </div>

    

    <div class="card col-12 px-0">
      <div class="card-block">
        <form id="upload" method="post" action="http://upload.qiniu.com/" enctype="multipart/form-data">
          <div class="form-group row">
            <input id="file" name="file" type="file">
          </div>
          <div class="form-group row">
            <label>key</label>
            <input id="key" name="key" class="form-control">
            <span class="help-box">保存的文件名，留空表示和上传文件同名</span>
          </div>
        </form>
      </div>
      <div class="card-footer text-center">
        <button type="button" class="btn  btn-success btn-block" @click.stop="upload()">上传</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUploadToken, locallySaveKey } from '../api/upload.js'
import $ from 'jquery'

export default {
  data () {
    return {
      uploadToken: ''
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
    upload: function () {
      var f = $('#file')[0].files[0]
      if (f === undefined) {
        this.showErrMsg('请先选择需要上传的文件')
        return
      }
      this.uploadToken = ''
      this.showLoading()

      getUploadToken(null,
        (jsonResult) => {
          console.log(jsonResult)
          this.uploadToken = jsonResult
        },
        null,
        () => {
          this.hideLoading()
          if (this.uploadToken.length > 0) {
            this.upload2(f, $('#key').val())
          }
        }
      )
    },
    upload2: function (f, key) {
      console.log(f)
      // console.log(key)
      var self = this

      // var formData = new window.FormData($('#upload')[0])
      var formData = new window.FormData()
      formData.append('token', this.uploadToken)
      formData.append('file', f)
      if (key.length === 0) {
        formData.append('key', f.name)
      } else {
        formData.append('key', key)
      }

      this.showLoading('uploading...')

      $.ajax({
        'mimeType': 'multipart/form-data',
        url: 'http://upload.qiniu.com/',
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (jsonResult) {
          console.log(jsonResult)
          console.log(jsonResult.key)
          if (jsonResult.key.length > 0) {
            self.showErrMsg('文件 ' + jsonResult.key + ' 上传成功')
            locallySaveKey(jsonResult.key)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.hideLoading()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          this.showErrMsg(textStatus + ', ' + errorThrown, 'danger')
          console.log(XMLHttpRequest)
          console.log(textStatus)
          console.log(errorThrown)
          console.log(XMLHttpRequest.responseJSON)
        }
      })

      // const file = $('$file').files[0]
      // const formData = new window.FormData()
      // formData.append('file', file)
      // formData.append('token', this.uploadToken)
      // if (key.length === 0) {
      //   formData.append('key', f.name)
      // } else {
      //   formData.append('key', key)
      // }

      // var settings = {
      //   'async': true,
      //   'crossDomain': true,
      //   'url': 'http://upload.qiniu.com/',
      //   'method': 'POST',
      //   'processData': false,
      //   'contentType': false,
      //   'mimeType': 'multipart/form-data',
      //   'data': formData
      // }

      // $.ajax(settings).done(function (response) {
      //   console.log(response)
      // })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.')
    })
  }
}
</script>
