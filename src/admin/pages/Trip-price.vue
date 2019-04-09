<template>  
	<div id="trip-day-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
        录入价格
    </div>

    <div class="card col-12 mt-2 card-outline-primary">
      <div class="card-block">
        <div class="form-group">
          <label>开始日期</label>
            <my-date-picker :id="'beginDate0'" :class="'form-control'" :placeholder="'开始日期'" v-model="beginDate"></my-date-picker> 
        </div>
        <div class="form-group">
          <label>截止日期</label>
            <my-date-picker :id="'endDate0'" :class="'form-control'" :placeholder="'截止日期'" v-model="endDate"></my-date-picker>  
        </div>
        <div class="form-group">
          <label>成人价格</label>
          <input class="form-control" type="text" placeholder="" v-model.number="price">
        </div>
        <div class="form-group">
          <label>儿童价格</label>
            <input class="form-control" type="text" placeholder="" v-model.number="childPrice">
        </div>
        <div class="form-group">
          <label>数量</label>
            <input class="form-control" type="text" placeholder="" v-model.number="count">
        </div>
        <div class="form-group">
          <label>提前预定天数</label>
            <input class="form-control" type="text" placeholder="" v-model.number="advanceDays">
        </div>
      </div>

      <div class="card-footer">
        <button class="weui-btn weui-btn_primary" @click="createTripPrice()">保存价格</button>
      </div>
    </div>

  </div>
</template>

<script>
import MyDatePicker from '../../components/my-datepicker.vue'
import { createTripPrice } from '../../api/trip.js'

export default {
  components: {
    MyDatePicker
  },
  data () {
    return {
      tripId: 0,
      beginDate: '',
      endDate: '',
      price: 0,
      childPrice: 0,
      count: 0,
      advanceDays: 1
    }
  },
  mounted: function () {
    this.tripId = this.$route.params.id

    window.scroll(0, 0)
  },
  destroyed () {
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
    createTripPrice: function () {
      var params = {
        'tripId': this.tripId,
        'fromDate': this.beginDate,
        'toDate': this.endDate,
        'price': this.price,
        'childPrice': this.childPrice,
        'count': this.count,
        'advanceDays': this.advanceDays
      }

      this.showLoading()

      createTripPrice(params,
        (jsonResult) => {
          console.log(jsonResult)
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.$router.replace('/trip/' + this.tripId)
            // this.reset()
          } else {
            this.showErrMsg('操作失败: ' + jsonResult.errmsg, 'danger')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    reset: function () {
      // this.day = 0
      // this.content = ''
    }

  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
