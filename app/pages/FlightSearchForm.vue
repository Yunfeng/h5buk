<template>
	<div id="searching" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left text-white" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          国内机票 
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <div class="card card-outline-info col-12 mt-2" style="padding-left: 0; padding-right: 0;">
        <div class="card-block">

          <div class="form-group row">
            <label class="col-3 col-form-label text-right">出发</label>
            <div class="col-9">
              <input class="form-control" type="text" placeholder="出发城市" v-model="dcityName" @focus="dcityFocusedEvent()" readonly>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-3 col-form-label text-right">到达</label>
            <div class="col-9">
              <input class="form-control" type="text" placeholder="到达城市" v-model="acityName" @focus="acityFocusedEvent()" readonly>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-3 col-form-label text-right">日期</label>
            <div class="col-9">
              <input class="form-control" type="text" placeholder="出发日期" v-model="ddate" id="ddate" readonly>
            </div>
          </div>
        </div>
        <div class="card-footer text-center text-white">
          <my-button @click="search()" type="info">查询航班</my-button>
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
  </div>
</template>

<script>
import MyButton from '../components/my-button.vue'
import MyCityPicker from '../components/my-citypicker.vue'
import $ from 'jquery'

export default {
  components: {
    'my-button': MyButton,
    'my-city-picker': MyCityPicker
  },
  data () {
    return {
      errMsg: '',
      errAlert: false,
      searching: false,
      targetName: '',
      showDialog: false,
      showPicker: false
    }
  },
  computed: {
    dcity () { return this.$store.state.searchParams.dcity },
    acity () { return this.$store.state.searchParams.acity },
    ddate () { return this.$store.state.searchParams.ddate },
    dcityName () { return this.$store.state.searchParams.dcityName },
    acityName () { return this.$store.state.searchParams.acityName }
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

      var ddate = $.cookie('ddate')
      var date0
      var cookieDate = $.cookie('ddate')
      if (cookieDate === undefined || cookieDate === null || cookieDate.length !== 10) {
        date0 = new Date()
        ddate = date0.format('yyyy-MM-dd')
      } else if (cookieDate !== undefined && cookieDate.length === 10) {
        date0 = new Date()
        var date1 = new Date(cookieDate)
        if (date1 < date0) {
          ddate = date0.format('yyyy-MM-dd')
        }
      }

      this.$store.commit('setDdate', ddate)
    }
  },
  mounted: function () {
    // console.log('SearchForm.vue is mounted.');
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
      // console.log(this.dcityName);
      // console.log(this.acityName);
      // console.log(this.dcity);
      // console.log(this.acity);
      this.searching = true
      // var self = this;
      // setTimeout(function(){self.searching = false;}, 5000);
      // setTimeout(() => this.searching = false, 5000);
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
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 2500)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
