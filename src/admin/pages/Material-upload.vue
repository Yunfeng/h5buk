<template>
	<div id="upload" class="row">
    <div class="col-12 bg-primary text-center text-white">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        </span>
        永久素材列表
    </div>
    <div class="card col-12">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>media type</th>
            <th>media id</th>
            <th>url</th>
            <th>name</th>
            <th>创建时间</th>
            <th>修改时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in dataList">
            <tr @click="showDetail(info)">
              <td>
                {{info.id}}
              </td>
              <td>{{info.materialType}}</td>
              <td>{{info.mediaId}}</td>
              <td>
                <template v-if="info.url">
                  <img :src="info.url" style="width: 2rem; height: 2rem">
                  <span :id="'url.' + info.id">{{info.url}}</span> 
                  <a @click.stop="copy('url.' + info.id)" class="small">复制</a>
                </template>
              </td>
              <td>{{info.name}}</td>
              <td>
                {{formatDateTime(info.createTime)}}
              </td>
              <td>
                {{formatDateTime(info.lastupdate)}}
              </td>
              <td>
                  <i class="fa fa-angle-right text-warning float-right" aria-hidden="true"></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card-block">
        <form id = "uploadFileForm" method="post" enctype="multipart/form-data">
          <div class="form-group">
              <label>选择需要上传的文件</label>
              <input type="file" name="upfile" id="inputFileName">
              <p class="help-block">图片，音频，</p>
          </div>    　　
          <div class="form-group">
              <button type="button" class="btn btn-primary" @click="upload();">上传</button>
          </div>
        </form>  
      </div>  
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { searchWxMaterials } from '../../api/material.js'
import { convertLongToTimeDesc, copySelectionText } from '../../common/common.js'

export default {
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      }
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    this.searchWxMaterials()
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
    upload: function () {
      var self = this
      this.loading = true
      var formData = new window.FormData($('#uploadFileForm')[0])

      $.ajax({
        url: '/Flight/upload/image',
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (jsonResult) {
          if (jsonResult !== null) {
            if (jsonResult.status !== 'OK') {
              self.showErrMsg(jsonResult.errmsg)
            } else {
              self.showErrMsg('上传成功, ' + jsonResult.desc)
              $('#inputFileName').val('')
              // self.imgUrl = 'http://staticfile.90sky.com/' + jsonResult.desc
            }
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          // hideLoading();
          console.log(textStatus)
          self.loading = false
          self.searchWxMaterials()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // console.log(returndata)
          if (XMLHttpRequest.status === 500) {
            self.showErrMsg('上传失败')
          }
          console.log(XMLHttpRequest.status)
          console.log(XMLHttpRequest.readyState)
          console.log(textStatus)
        }
      })
    },
    searchWxMaterials: function () {
      this.showLoading()

      const params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchWxMaterials(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
    },
    copy: function (id) {
      copySelectionText(id)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
