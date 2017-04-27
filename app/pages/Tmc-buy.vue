<template>  
	<div id="tmc-buy" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          采购大客户政策
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <div class="card col-12">
        <textarea class="form-control" placeholder="请粘帖编码内容于此" rows="12" v-model="pnrDetail"></textarea>
        <p class="form-text text-muted">
          若无编码内容，请从航班查询开始
        </p>
              <div class="weui-btn-area">
            <button type="button" class="weui-btn weui-btn_primary" @click.stop="nextStep()">下一步</button>
            <button type="button" class="weui-btn weui-btn_detail" @click.stop="emptyPnrDetail()">清空</button>
      </div>

      </div>
    </div> 

    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: '数据加载中',
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
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 2500)
    },
    emptyPnrDetail: function () {
      this.pnrDetail = ''
    },
    nextStep: function () {
      this.doJob0()
    },
    doJob0: function () {
      if (this.pnrDetail !== null && this.pnrDetail.length > 10) {
        var self = this
        self.loading = true
        self.loadingText = '编码内容处理中'

        $.ajax({
          type: 'post',
          url: '/Flight/pnr/processPnrDetail',
          data: { pnrDetail: this.pnrDetail },
          dataType: 'json',
          success: function (jsonResult) {
            if (jsonResult !== null) {
              self.prepareOrder(jsonResult)
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 403) {
              self.$store.commit('jumpToLogin', self.$router)
            }
          },
          complete: function (XMLHttpRequest, textStatus) {
            self.loading = false
          }
        })
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
        fltInfo.atime = flt.arrivalTime
        fltInfo.price = flt.price
        fltInfo.dportName = flt.departureAirport
        fltInfo.aportName = flt.arrivalAirport
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
