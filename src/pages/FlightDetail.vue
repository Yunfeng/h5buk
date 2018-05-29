<template>
	<div id="flight-result" class="row">
      <div class="col-12 bg-info text-center text-white">
        <span @click="back()" class="float-left fa-2">
          <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        </span>
        <span class="fa-2 text-white">{{flt.flightNo}}</span>
        <small class="text-warning">{{flt.depDate}}</small>
      </div>           
    
      <div class="card col-12">
        <div class="row">
          <div class="col-4 text-nowrap">
            <span class="time text-success">{{flt.showDepTime}}</span>
            <small>出发</small>
          </div>
          <div class="col-4 text-nowrap">
            <span class="time text-muted">{{flt.showArrTime}}</span>
            <small>到达</small>
          </div>
          <div class="col-4 text-nowrap text-warning text-right">
            <template v-if="flt.lowestPrice">
              <i class="fa fa-rmb"></i> <span class="lowest-price mr-1">{{flt.lowestPrice.price}}</span>
            </template>
          </div>
          <div class="clear"></div>
        </div>
        <div class="row">
          <div class="col-4 text-nowrap">
            <span class="time text-success">{{flt.depPortName}}</span>
            <small>{{flt.depTerminal}}</small>
          </div>
          <div class="col-4 text-nowrap">
            <span class="time text-muted">{{flt.arrPortName}}</span>
            <small>{{flt.arrTerminal}}</small>
          </div>
          <div class="col-4 text-right">
            <span v-if="flt.stopover !== '0'">{{flt.stopover}}</span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="row">
          <div class="col-3 text-right text-nowrap"> {{flt.carrierName}} </div>
          <div class="col-3 text-center text-nowrap">机型：{{flt.planeType}} </div>
          <div class="col-3 text-center text-nowrap">
            <p v-if="flt.codeShared === '1'">代码共享</p>
          </div>
          <div class="col-3 text-center text-nowrap">{{flt.carrierFlightNo}} </div>
          <div class="clear"></div>
        </div>          
      </div>

      <table class="table table-striped">
        <tbody>
          <tr v-for="info in sortSubclass(flt.subClassList)">
            <td class="text-right px-1"><small>{{showCabinClass(info.cabinClass, info.offset)}} {{info.subClass}}</small></td>
            <td class="text-center">
              <span :id="'tgq-' + flt.id + '-' + info.subClass" tgq-cached="0" @click="showTGQ(flt.carrierCode, info.subClass)"><small>退改</small></span>
            </td>
            <td class="text-right">
              <template v-if="info.price > 0">
                <i class="fa fa-rmb text-warning"></i> <span class="text-danger fa-2">{{info.price}}</span>
              </template>
              <template v-else>
                <span class="text-danger"><small>浮动</small></span>
              </template>
            </td>
            <td class="text-right">
              <span v-if="info.seatCount < 10" class="text-danger"><small>{{info.seatCount}}张</small></span>

              <a @click.stop="bookFlight(flt, info);" :title="info.price + '元，余位' + info.seatStatus" class="btn btn-outline-info btn-sm">预定</a>              
            </td>
          </tr>
        </tbody>
      </table>

      <div class="card col-12 border-0" v-if="flt.freshness < 60">
        <div class="card-block text-right">
          <small>更新时间: <span class="text-success">{{showFreshness(flt.freshness)}}</span></small>
        </div>
      </div>

    <div class="modal fade" id="tgqModal">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import { getCabinClassDesc, addDate } from '../common/common.js'
import { rav, searchTgq } from '../api/flight.js'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import $ from 'jquery'

export default {
  components: {
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      tgqCarrier: '',
      tgqSubclass: ''
    }
  },
  computed: {
    flt () { return this.$store.state.flightInfo }
  },
  mounted: function () {
    this.$store.commit('hideBottomTabBar')
  },
  beforeDestroy: function () {
    this.$store.commit('showBottomTabBar')
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    sortSubclass: function (classList) {
      if (classList === null) return null

      var returnedList = classList.slice(0) // 此处若不新建数组，Vue.js总是发警告说 infinite loop

      returnedList.sort(function (a, b) {
        var price0 = 1000000
        var price1 = 1000000
        if (a.price !== 0) price0 = a.price
        if (b.price !== 0) price1 = b.price

        return price0 - price1
      })

      return returnedList
    },
    showCabinClass: function (cabinClass, offset) {
      return getCabinClassDesc(cabinClass, offset)
    },
    showFreshness: function (freshness) {
      if (freshness <= 5) {
        return '刚刚'
      } else {
        return freshness + ' 分钟前'
      }
    },
    bookFlight: function (flt0, subclass0) {
      console.log(flt0)
      var fltInfo = {
        'flightNo': flt0.flightNo,
        'carrierName': flt0.carrierName,
        'ddate': flt0.depDate,
        'dport': flt0.depPort,
        'aport': flt0.arrPort,
        'dtime': flt0.depTime,
        'showDtime': flt0.showDepTime,
        'atime': flt0.arrTime,
        'showAtime': flt0.showArrTime,
        'dportName': flt0.depPortName,
        'dterm': flt0.depTerminal,
        'aportName': flt0.arrPortName,
        'aterm': flt0.arrTerminal,
        'subclass': subclass0.subClass,
        'price': subclass0.price,
        'returnPoint': subclass0.returnPoint
      }

      this.$store.commit('addFlight', fltInfo)
      this.$router.replace('/booking')
    },
    showTGQ: function (carrier, subclass) {
      this.tgqCarrier = carrier
      this.tgqSubclass = subclass
      var params = { 'carrier': carrier,
        'subclass': subclass
      }

      searchTgq(params, this.tgqDone)
    },
    tgqDone: function (jsonResult) {
      var self = this
      var tgqDetail = ''
      if (jsonResult.dataList.length > 0) {
        var info = jsonResult.dataList[0]
        if (info.endorsementRule != null) {
          tgqDetail = '签转：' + info.endorsementRule + '.<br />'
        }

        tgqDetail += '更改：起飞前'
        if (info.rerouteRuleBefore === 0) {
          tgqDetail += '免手续费, '
        } else {
          tgqDetail += info.rerouteRuleBefore + '%手续费, '
        }
        tgqDetail += '起飞后'
        if (info.rerouteRuleAfter === 0) {
          tgqDetail += '免手续费. '
        } else {
          tgqDetail += info.rerouteRuleAfter + '%手续费.'
        }
        tgqDetail += '<br />'

        tgqDetail += '退票：起飞前'
        if (info.refundRuleBefore === 0) {
          tgqDetail += '免手续费, '
        } else {
          tgqDetail += info.refundRuleBefore + '%手续费, '
        }
        tgqDetail += '起飞后'
        if (info.refundRuleAfter === 0) {
          tgqDetail += '免手续费. '
        } else {
          tgqDetail += info.refundRuleAfter + '%手续费.'
        }
        tgqDetail += '<br />'
      } else {
        tgqDetail = '具体退改签信息请咨询客服'
      }

      self.dispalyTgqInfo(self.tgqCarrier, self.tgqSubclass, tgqDetail)
    },
    dispalyTgqInfo: function (carrier, subclass, tgqDetail) {
      var modal = $('#tgqModal')
      var title = carrier + ' ' + subclass + ' 退改签信息'
      modal.find('.modal-title').text(title)
      modal.find('.modal-body').html(tgqDetail)
      modal.modal('show')
    },
    changeDdate: function (x) {
      var newDate = addDate(this.ddate, x)

      this.$store.commit('setDdate', newDate)
      this.readyToSearch()
    }
  }
}
</script>

<style>
  .time {
    font-size: 150%
  }
  .lowest-price {
    font-size: 160%;
    font-weight: bold;
  }
  .airport {
    font-size: 110%
  }
</style>
