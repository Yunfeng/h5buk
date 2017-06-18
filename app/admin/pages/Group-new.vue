<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        录入团队机票
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>名称</td>
          <td><input class="weui-input" placeholder="线路名称" v-model.trim="tripName"></td>
        </tr>
        <tr>
          <td>出发城市</td>
          <td><input class="weui-input" placeholder="出发城市/机场代码, 三字码" v-model.trim="tripFrom"></td>
        </tr>
        <tr>
          <td>目的城市</td>
          <td><input class="weui-input" placeholder="目的城市/机场代码, 三字码" v-model.trim="tripTo"></td>
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
        <button class="weui-btn weui-btn_primary" @click="createGroupTravel()">创建</button>
      </div>
    </div>

  </div>
</template>

<script>
import { createGroupTravel, getGroupTravel } from '../../api/group-flight.js'
import UE from 'UE'
import $ from 'jquery'

export default {
  data () {
    return {
      id: 0,
      tripName: '',
      tripFrom: '',
      tripTo: '',
      tripContent: '',
      buyUrl: '',
      buyContact: '',
      price: 0,
      minDate: '',
      maxDate: '',

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
    createGroupTravel: function () {
      var params = {
        'name': this.tripName.toUpperCase(),
        'from': this.tripFrom.toUpperCase(),
        'to': this.tripTo.toUpperCase(),
        'price': this.price,
        'content': this.editor.getContent(),
        'buyUrl': this.buyUrl,
        'buyContact': this.buyContact,
        'minDate': this.minDate,
        'maxDate': this.maxDate
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
    },
    reset: function () {
      this.id = 0
      this.tripName = ''
      this.tripFrom = ''
      this.tripTo = ''
      this.price = ''
      this.tripContent = ''
      this.buyUrl = ''
      this.buyContact = ''
      this.minDate = ''
      this.maxData = ''

      this.editor.setContent(this.tripContent, true)
    },
    init: function () {
      this.showLoading()

      getGroupTravel(this.id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === this.id) {
            this.id = 0
            this.tripName = jsonResult.name
            this.tripFrom = jsonResult.dcity
            this.tripTo = jsonResult.acity
            this.buyUrl = jsonResult.buyUrl
            this.buyContact = jsonResult.buyContact
            this.price = jsonResult.price

            this.tripContent = jsonResult.content
            this.editor.setContent(this.tripContent, true)
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
