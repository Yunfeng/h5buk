<template>  
	<div id="tmc-buy" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      编码导入生成订单
    </div> 
    

    <div class="card col-12">
      <textarea class="form-control" placeholder="请粘帖编码内容于此" rows="12" v-model="pnrDetail"></textarea>
      <p class="form-text text-muted">
        若无编码内容，请从航班查询开始
      </p>
      <div class="card-footer">
          <button type="button" class="btn btn-block btn-success" @click.stop="nextStep()">下一步</button>
          <button type="button" class="btn btn-block btn-secondary" @click.stop="emptyPnrDetail()">清空</button>
      </div>
    </div>

  </div>
</template>

<script>
import { processPnrDetail } from '../api/flight.js'

export default {
  data () {
    return {
      idTypes: [
        { idType: 1, idName: '身份证' },
        { idType: 2, idName: '护照' }
      ],
      pnrDetail: '',
      pnr: null
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    // this.search()
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
    emptyPnrDetail: function () {
      this.pnrDetail = ''
    },
    nextStep: function () {
      this.doJob0()
    },
    doJob0: function () {
      if (this.pnrDetail !== null && this.pnrDetail.length > 10) {
        this.showLoading('编码内容处理中')

        var params = { pnrDetail: this.pnrDetail }

        processPnrDetail(params,
          (jsonResult) => { this.prepareOrder(jsonResult) },
          null,
          () => { this.hideLoading() }
        )
      } else {
        this.showErrMsg('请粘帖编码内容')
      }
    },
    prepareOrder: function (jsonResult) {
      var length = jsonResult.passengers.length
      for (var i = 0; i < length; i++) {
        var psg = jsonResult.passengers[i]

        var psgInfo = {}
        psgInfo.psgName = psg.psgName
        psgInfo.idNo = psg.idNo
        if (psg.idType === null || psg.idType === 'NI') {
          psgInfo.idType = 1
        } else {
          psgInfo.idType = 2
        }

        this.$store.commit('addPsg', psgInfo)
      }

      length = jsonResult.flights.length
      for (i = 0; i < length; i++) {
        var flt = jsonResult.flights[i].flight

        var fltInfo = {}

        fltInfo.flightNo = flt.flightNo
        fltInfo.ddate = flt.departureDate
        fltInfo.subclass = flt.subclass
        fltInfo.dport = flt.departureAirport
        fltInfo.aport = flt.arrivalAirport
        fltInfo.dtime = flt.departureTime
        fltInfo.showDtime = flt.departureTime
        fltInfo.atime = flt.arrivalTime
        fltInfo.showAtime = flt.arrivalTime
        fltInfo.price = flt.price
        fltInfo.dportName = flt.dportName
        fltInfo.aportName = flt.aportName
        fltInfo.returnPoint = 0

        this.$store.commit('addFlight', fltInfo)
      }

      var orderInfo = {
        'pnrNo': jsonResult.pnrNo,
        'pnrDetail': jsonResult.pnrDetail,
        'policyId': -1
      }

      this.$store.commit('setOrderInfo', orderInfo)
      this.$router.replace('/booking')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
