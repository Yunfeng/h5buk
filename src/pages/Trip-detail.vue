<template>  
	<div id="article-detail" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2 sticky-top" style="opacity:0.6;">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      线路详情
    </div>

    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title">{{detail.name}}</h4>    
          <p class="small">
            <span class="text-info">{{detail.dcity}}</span>出发
          </p>
        </div>       
        <span class="bg-faded text-center text-muted">团期</span>
        <trip-date-picker :prices="detail.priceInfos" @dateSelected="selectTripDate"></trip-date-picker>
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div class="card">
            <div class="card-header" role="tab" id="headingTripTwo">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTripTwo" aria-expanded="false" aria-controls="collapseTripTwo">
                  行程特色
                </a>
              </h5>
            </div>
            <div id="collapseTripTwo" class="collapse show" role="tabpanel" aria-labelledby="headingTripTwo">
              <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" role="tab" id="headingTripThree">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTripThree" aria-expanded="false" aria-controls="collapseTripThree">
                  每日安排
                </a>
              </h5>
            </div>
            <div id="collapseTripThree" class="collapse show" role="tabpanel" aria-labelledby="headingTripThree">
              <table class="table">
                  <tbody>
                    <template v-for="dayInfo in detail.dayInfos">
                      <tr class="bg-info text-white">
                        <td>第{{dayInfo.day}}天</td>
                        <td>
                          {{dayInfo.currentStop}} 
                          <template v-if="dayInfo.nextStop">
                            - {{dayInfo.nextStop}}
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2"><span v-html="dayInfo.content"></span></td>
                      </tr>
                      <tr>
                        <td colspan="2" class="text-center">
                          <template v-if="dayInfo.breakfast || dayInfo.lunch || dayInfo.supper">
                            含 <span v-if="dayInfo.breakfast">早餐</span>
                            <span v-if="dayInfo.lunch">午餐</span>
                            <span v-if="dayInfo.supper">晚餐</span>
                            <br />
                            </template>
                          <span v-if="dayInfo.accommodation">住宿：{{dayInfo.accommodation}}</span>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
            </div>
          </div>
        </div>                
      </div>
    </template>     
  </div>
</template>

<script>
import { getTripDetail } from '../api/trip.js'
import { convertLongToTimeDesc } from '../common/common.js'
import TripDatePicker from '../components/my-trip-date-picker.vue'

export default {
  components: {
    TripDatePicker
  },
  data () {
    return {
      id: 0,
      detail: null
    }
  },
  mounted: function () {
    this.id = parseInt(this.$route.params.id)
    this.refreshTripDetail(this.id)
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
    refreshTripDetail: function (id) {
      this.showLoading()

      getTripDetail(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.detail = jsonResult
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    selectTripDate: function (tripDate, price) {
      // console.log(tripDate)
      // window.alert(tripDate + ', ' + price)
      this.$router.push('/trip/' + this.id + '/' + tripDate)
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
