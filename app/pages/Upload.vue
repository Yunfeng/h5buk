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
  watch: {
    total0 (curVal, oldVal) {
      console.log(curVal, oldVal)
      if (curVal === null) {
        this.total = null
      } else {
        this.total = parseInt(curVal * 100)
      }
    }
  },
  mounted: function () {
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

      this.showLoading()
      this.uploadToken = ''

      getUploadToken(null,
        (jsonResult) => {
          this.uploadToken = jsonResult
          // console.log(jsonResult)
        },
        null,
        () => {
          if (this.uploadToken.length > 0) {
            // console.log(this.uploadToken)
            this.upload2(f, $('#key').val())
          } else {
            this.hideLoading()
          }
        }
      )
    },
    upload2: function (f, key) {
      var self = this

      var formData = new window.FormData($('#upload')[0])
      formData.append('token', this.uploadToken)
      formData.append('file', f)
      if (key.length === 0) {
        formData.append('key', f.name)
      } else {
        formData.append('key', key)
      }

      $.ajax({
        url: 'http://upload.qiniu.com/',
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (jsonResult) {
          console.log(jsonResult)
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
    },
    createPayOrder: function () {
      var self = this

      if (this.total === null || this.total < 1) {
        this.showErrMsg('请输入充值金额')
        return
      }

      self.showLoading('支付准备中...')

      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/pay/createRechargeOrder',
        data: {
          'total_fee': self.total
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.orderId = jsonResult.desc
            self.weixinPay()
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function () {
          self.hideLoading()
        }
      })
    },
    weixinPay: function () {
      var self = this
      // get weixin appid
      $.ajax({
        type: 'post',
        url: '/Flight/weixin/getAppid',
        dataType: 'text',
        success: function (jsonResult) {
          console.log(jsonResult)
          self.appid = jsonResult
          var url1 = self.redirectUrl
          var url0 = escape(url1)

          var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            self.appid + '&redirect_uri=' + url0 + '&response_type=code&scope=snsapi_base&state=' + self.orderId + '#wechat_redirect'
          window.location.href = url
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function () {
          self.hideLoading()
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log('i m in.')
    })
  }
}
</script>
