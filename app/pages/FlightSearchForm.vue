<template>
	<div id="searching" class="row" style="background-color: #2E9CDF;">
    <div class="col-12 bg-info text-center text-white">
      <span class="fa-2">国内机票</span>
    </div> 

    <div class="card col-12 mt-2 mb-2 p-0 border-0">
      <div class="card-block">
        <div class="form-group row">
          <div class="col-5" style="border-bottom: 1px solid #5bc0de;">
              <input class="form-control border-0 " type="text" placeholder="出发城市" v-model="dcityName" @focus="dcityFocusedEvent()">
          </div>
          <div class="col-2 text-center">
            <span @click="switchCity()"><i class="fa fa-exchange align-middle" aria-hidden="true"></i></span>
          </div>
          <div class="col-5" style="border-bottom: 1px solid #5bc0de;">
            <input class="form-control text-right border-0" type="text" placeholder="到达城市" v-model="acityName" @focus="acityFocusedEvent()">
          </div>

        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">日期</label>
          <div class="col-8" style="border-bottom: 1px solid #5bc0de;">
            <input class="form-control border-0" type="text" placeholder="出发日期" v-model="ddate" id="ddate">
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">航空公司</label>
          <div class="col-8" style="border-bottom: 1px solid #5bc0de;">
            <select class="form-control border-0" v-model="onlyCarrier">
                <option value="">不限</option>
                <option value="CA">中国国航-CA</option>
                <option value="CZ">南方航空-CZ</option>
                <option value="MU">东方航空-MU</option>
                <option value="">——————</option>
                <option value="BK">A-奥凯航空公司-BK</option>
                <option value="JD">B-北京首都航空有限公司-JD</option>
                <option value="GJ">C-长龙航空公司-GJ</option>
                <option value="9C">C-春秋航空公司-9C</option>
                <option value="EU">C-成都航空有限公司-EU</option>
                <option value="CN">D-大新华航空公司-CN</option>
                <option value="DZ">D-东海航空公司-DZ</option>
                <option value="NS">H-河北航空公司-NS</option>
                <option value="HU">H-海南航空公司-HU</option>
                <option value="G5">H-华夏航空公司-G5</option>
                <option value="HO">J-吉祥航空公司-HO</option>
                <option value="KY">K-昆明航空有限公司-KY</option>
                <option value="QW">Q-青岛航空公司-QW</option>
                <option value="3U">S-四川航空公司-3U</option>
                <option value="SC">S-山东航空公司-SC</option>
                <option value="ZH">S-深圳航空公司-ZH</option>
                <option value="FM">S-上海航空公司-FM</option>
                <option value="GS">T-天津航空有限责任公司-GS</option>
                <option value="PN">X-西部航空公司-PN</option>
                <option value="TV">X-西藏航空公司-TV</option>
                <option value="JR">X-幸福航空有限责任公司-JR</option>
                <option value="MF">X-厦门航空有限公司-MF</option>
                <option value="8L">X-祥鹏航空公司-8L</option>
                <option value="YI">Y-英安航空公司-YI</option>
                <option value="KN">Z-中国联合航空公司-KN</option>
            </select>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">排序方式</label>
          <div class="col-8" style="border-bottom: 1px solid #5bc0de;">
            <select v-model="sortBy" class="form-control border-0" >
                    <option value="0">起飞时间升序</option>
                    <option value="1">起飞时间降序</option>
                    <option value="2">最低价格升序</option>
                    <option value="3">最低价格降序</option>
            </select>
          </div>
        </div>

      </div>
      <div class="card-footer text-center text-white border-0">
        <button type="button" @click.stop="search()" class="btn btn-warning btn-block btn-lg">搜索</button>
      </div>
    </div>

    <my-city-picker :show="showPicker" @close="cityPickerClosed(false)" :target="targetName"></my-city-picker>

    <div id="loadingToast" v-show="searching">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">数据加载中</p>
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from '../components/my-button.vue'
import MyCityPicker from '../components/my-citypicker.vue'
import { addDate } from '../common/common.js'
import $ from 'jquery'

export default {
  components: {
    'my-button': MyButton,
    'my-city-picker': MyCityPicker
  },
  data () {
    return {
      searching: false,
      targetName: '',
      showDialog: false,
      showPicker: false,

      onlyCarrier: '',
      sortBy: 0
    }
  },
  computed: {
    dcity () { return this.$store.state.searchParams.dcity },
    acity () { return this.$store.state.searchParams.acity },
    ddate () { return this.$store.state.searchParams.ddate },
    dcityName () { return this.$store.state.searchParams.dcityName },
    acityName () { return this.$store.state.searchParams.acityName }
    // onlyCarrier () { return this.$store.state.searchParams.onlyCarrier },
    // sortBy () { return this.$store.state.searchParams.sortBy }
  },
  watch: {
    onlyCarrier (curVal, oldVal) {
      this.$store.commit('setOnlyCarrier', curVal)
    },
    sortBy (curVal, oldVal) {
      this.$store.commit('setSortBy', parseInt(curVal))
    }
  },
  created: function () {
    if (this.dcity == null || this.dcity.length === 0) {
      var cityCode = $.cookie('dcity')
      var cityName = $.cookie('dcityName')
      if (cityCode === undefined || cityCode === null || cityCode.length !== 3) {
        cityCode = 'SHA'
        cityName = '上海'
      }
      this.$store.commit('setDcity', { 'cityCode': cityCode, 'cityName': cityName })

      cityCode = $.cookie('acity')
      cityName = $.cookie('acityName')
      if (cityCode === undefined || cityCode === null || cityCode.length !== 3) {
        cityCode = 'KHN'
        cityName = '南昌'
      }
      this.$store.commit('setAcity', { 'cityCode': cityCode, 'cityName': cityName })

      var ddate
      console.log(ddate)
      var date0 = new Date()

      const hours = date0.getHours()
      console.log(hours)

      // var oDate = new Date(); //实例一个时间对象；
      // oDate.getFullYear();   //获取系统的年；
      // oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
      // oDate.getDate(); // 获取系统日，
      // oDate.getHours(); //获取系统时，
      // oDate.getMinutes(); //分
      // oDate.getSeconds(); //秒

      var cookieDate = $.cookie('ddate')
      if (cookieDate === undefined || cookieDate === null || cookieDate.length !== 10) {
        // date0 = new Date()
        if (hours > 18) {
          ddate = addDate(date0, 1)
        } else {
          ddate = date0.format('yyyy-MM-dd')
        }
      } else if (cookieDate !== undefined && cookieDate.length === 10) {
        // date0 = new Date()
        var date1 = new Date(cookieDate)
        if (date1 < date0) {
          if (hours > 18) {
            ddate = addDate(date0, 1)
          } else {
            ddate = date0.format('yyyy-MM-dd')
          }
        }
      }

      console.log(ddate)

      this.$store.commit('setDdate', ddate)
    }
  },
  mounted: function () {
    var self = this
    var today = new Date()

    $('#ddate').datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      minDate: today,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.$store.commit('setDdate', dateText)
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    search: function () {
      if (this.dcity === undefined || this.acity === undefined || this.ddate === undefined) {
        this.showErrMsg('请确定下需要查什么')
        return
      }

      if (this.dcity.length !== 3 || this.dcityName.length < 1 || this.acity.length !== 3 || this.acityName.length < 1) {
        this.showErrMsg('请选择出发/到达城市')
        return
      }

      if (this.dcity === this.acity) {
        this.showErrMsg('出发和到达城市不能相同')
        return
      }

      if (this.ddate.length <= 8) {
        this.showErrMsg('请选定乘机日期')
        return
      }

      $.cookie('dcity', this.dcity)
      $.cookie('dcityName', this.dcityName)
      $.cookie('acity', this.acity)
      $.cookie('acityName', this.acityName)
      $.cookie('ddate', this.ddate)

      // 查询航班
      this.searching = true
      this.$router.push('/searchResult')
    },
    cityPickerClosed: function (val) {
      this.showPicker = val
    },
    dcityFocusedEvent: function () {
      this.targetName = 'Dcity'
      this.showPicker = true
    },
    acityFocusedEvent: function () {
      this.targetName = 'Acity'
      this.showPicker = true
    },
    switchCity: function () {
      this.$store.commit('switchCity')
    }
  }
}
</script>
