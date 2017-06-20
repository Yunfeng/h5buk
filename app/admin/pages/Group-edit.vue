<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        修改团队机票 <small>id: {{id}}</small>
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>线路名称</td>
          <td><input class="weui-input" placeholder="线路名称" v-model.trim="tripName"></td>
        </tr>
        <tr>
          <td>出发地</td>
          <td><input class="weui-input" placeholder="出发地" v-model.trim="tripFrom"></td>
        </tr>
        <tr>
          <td>目的地</td>
          <td><input class="weui-input" placeholder="目的地" v-model.trim="tripTo"></td>
        </tr>
        <tr>
          <td>最早日期</td>
          <td><input class="weui-input" placeholder="格式：yyyy-MM-dd" v-model.trim="minDate" id="minDate"></td>
        </tr>
        <tr>
          <td>最晚日期</td>
          <td><input class="weui-input" placeholder="格式：yyyy-MM-dd" v-model.trim="maxDate" id="maxDate"></td>
        </tr>        
        <tr>
          <td>价格</td>
          <td><input class="weui-input" placeholder="最低价格" v-model.number="price"></td>
        </tr>
        <tr>
          <td>购买链接</td>
          <td><input class="weui-input" placeholder="购买链接" v-model.trim="buyUrl"></td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td><input class="weui-input" placeholder="联系方式" v-model.trim="buyContact"></td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td>{{formatDateTime(createTime)}}</td>
        </tr>
        <tr>
          <td>上次修改时间</td>
          <td>{{formatDateTime(lastupdate)}}</td>
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
      </table>

      <div class="card-footer">
        <button class="weui-btn weui-btn_primary" @click="saveGroupTravel()">保存</button>
      </div>
    </div>

  </div>
</template>

<script>
import { createGroupTravel, getGroupTravel } from '../../api/group-flight.js'
import { convertLongToTimeDesc } from '../../common/common.js'
import UE from 'UE'
import $ from 'jquery'

export default {
  data () {
    return {
      id: 0,
      tripName: '',
      tripFrom: '',
      tripTo: '',
      minDate: '',
      maxDate: '',
      tripContent: '',
      buyUrl: '',
      buyContact: '',
      price: 0,

      createTime: null,
      lastupdate: null,

      editor: null
    }
  },
  mounted: function () {
    window.UMEDITOR_HOME_URL = '/ueditor/'
    this.editor = UE.getEditor('myEditor')

    var id = this.$route.params.id
    if (id !== undefined) {
      this.id = parseInt(id)
      this.init()
    }

    var self = this
    var today = new Date()

    $('#minDate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      minDate: today,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.minDate = dateText
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })

    $('#maxDate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      minDate: today,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.maxDate = dateText
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })
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
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    reset: function () {
      this.id = 0
      this.tripName = ''
      this.tripFrom = ''
      this.tripTo = ''
      this.minDate = ''
      this.maxDate = ''
      this.tripContent = ''
      this.price = 0
      this.buyUrl = ''
      this.buyContact = ''
    },
    init: function () {
      this.showLoading()

      getGroupTravel(this.id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === this.id) {
            this.tripName = jsonResult.name
            this.tripFrom = jsonResult.dcity
            this.tripTo = jsonResult.acity
            this.minDate = jsonResult.minDate
            this.maxDate = jsonResult.maxDate
            this.buyUrl = jsonResult.buyUrl
            this.buyContact = jsonResult.buyContact
            this.price = jsonResult.price

            this.tripContent = jsonResult.content
            // this.editor.setContent(this.tripContent, true)

            this.createTime = jsonResult.createTime
            this.lastupdate = jsonResult.lastupdate

            const self = this

            this.editor.ready(function () {
              self.editor.setContent(self.tripContent, true)
            })
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    saveGroupTravel: function () {
      var params = {
        'id': this.id,
        'name': this.tripName,
        'from': this.tripFrom,
        'to': this.tripTo,
        'minDate': this.minDate,
        'maxDate': this.maxDate,
        'price': this.price,
        'content': this.editor.getContent(),
        'buyUrl': this.buyUrl,
        'buyContact': this.buyContact
      }

      this.showLoading()

      createGroupTravel(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.$router.replace('/group/' + jsonResult.returnCode)
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
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
    })
  }
}
</script>
