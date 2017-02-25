<template>
	<div id="flight-result" class="container-fluid">
    <template v-if="listShowing">
      <div class="row bg-info">
        <div class="col-12 text-center text-white">
            <span @click="back()" class="float-left"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
             {{dcityName}}-{{acityName}} {{ddate}}
             

          <span @click="showFilter()" class="float-right">
            ({{showCount}}/{{totalCount}})
            <i class="fa fa-filter" aria-hidden="true"></i>
          </span>   
        </div>         
      </div> 

      <div class="row">
        <table class="table table-striped table-hover" >
          <thead>
              <th class="text-center">航班</th>
              <th class="text-center hidden-sm-down">出发</th>
              <th class="text-center hidden-sm-down">到达</th>
              <th class="text-center">时间</th>
              <th class="text-center">价格</th>
          </thead>
            <tbody>
                <tr v-for="flight in execSort(searchFlightResults)" @click="showFlightDetail(flight)" name="flightItem">
                    <td class="text-center">
                      {{flight.flightNo}}
                      <br />
                      {{flight.carrierName}}
                    </td>
                    <td class="text-center hidden-sm-down">{{flight.depPortName}}</td>
                    <td class="text-center hidden-sm-down">{{flight.arrPortName}}</td>
                    <td class="text-center">{{flight.depTime}} <small>{{flight.arrTime}}</small></td>
                    <td class="text-right">
                        <div v-if="flight.subClassList.length > 0">
                            <template v-if="flight.lowestPrice != null">
                                <i class="fa fa-rmb"></i>
                                <span class="text-info">
                                  <big><strong>{{flight.lowestPrice.price}}</strong></big>
                                </span>
                                  <i class="fa fa-long-arrow-up" aria-hidden="true"></i>

                            </template>    
                        </div>
                        <div v-else>
                            <span class="text-danger">已售完</span>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
      </div>
    </template>

    <div id="flightDetail" v-show="detailShowing">
      <template v-if="flt">
        <div class="row bg-info">
          <div class="col-12 text-center text-white">
            <span @click="closeDetail()" class="float-left"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
               {{flt.flightNo}} <small>{{flt.depDate}}</small>
          </div>         
        </div> 
      
        <div class="row">
          <div class="card col-12" style="padding-left: 0; padding-right: 0;">
            <div class="row">
              <div class="col-3 text-center text-nowrap time">{{flt.showDepTime}}</div>
              <div class="col-3">&nbsp;</div>
              <div class="col-3 text-center text-nowrap time">{{flt.showArrTime}}</div>
              <div class="col-3 text-nowrap text-danger text-right lowest-price">
                <template v-if="flt.lowestPrice">
                  <i class="fa fa-rmb"></i>{{flt.lowestPrice.price}}
                </template>
              </div>
              <div class="clear"></div>
            </div>
            <div class="row">
              <div class="col-3 text-center text-nowrap airport">{{flt.depPortName}} {{flt.depTerminal}}</div>
              <div class="col-3 text-center">
                <p v-if="flt.stopover !== '0'">{{flt.stopover}}</p>
              </div>
              <div class="col-3 text-center text-nowrap airport">{{flt.arrPortName}} {{flt.arrTerminal}}</div>
              <div class="col-3 text-right">&nbsp;</div>
              <div class="clear"></div>
            </div>
            <div class="row">
              <div class="col-3 text-center text-nowrap ">{{flt.carrierName}} </div>
              <div class="col-3 text-center text-nowrap">{{flt.planeType}} </div>
              <div class="col-3 text-center text-nowrap">
                <p v-if="flt.codeShared === '1'">代码共享</p>
              </div>
              <div class="col-3 text-center text-nowrap">{{flt.carrierFlightNo}} </div>
              <div class="clear"></div>
            </div>          
          </div>
        </div>
        <div class="row">
          <table class="table table-striped">
            <tbody>
              <tr v-for="info in sortSubclass(flt.subClassList)">
                <td class="text-center">{{showCabinClass(info.cabinClass)}}</td>
                <td class="hidden"><small v-if="info.returnPoint > 0">返{{info.returnPoint}}% </small></td>
                <td class="text-center">
                  <span :id="'tgq-' + flt.id + '-' + info.subClass" @mouseover="showTGQ(flt.id, flt.carrierCode, info.subClass);" @mouseout="hideTGQ(flt.id, flt.carrierCode, info.subClass);" tgq-cached="0"><small>退改签</small></span>
                </td>
                <td class="text-right"><strong>{{info.price}}</strong>/{{info.subClass}}</td>
                <td class="text-right">
                  <span v-if="info.seatCount < 10"> {{info.seatCount}} </span>
                </td>
                <td class="text-center">
                  <a v-on:click="bookFlight(flt.flightNo, flt.depDate, info.subClass, flt.depPort, flt.arrPort, flt.depTime, flt.arrTime, info.price, flt.depPortName, flt.arrPortName, info.returnPoint);" v-bind:title="info.price + '元，余位' + info.seatStatus" class="btn btn-info btn-sm">预定</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          <div class="weui-cell">
            <div class="weui-cell__bd text-right">
              更新时间: {{flt.freshness}}
            </div>
          </div>
        
      </template>
    </div>

    <div id="filterModal" v-show="filterModalShowing">
      <div class="container-fluid">
        <div class="row" style="margin-top: 5px; margin-bottom: 5px">
          <div class="col-xs-12 text-right">              
            <button type="button" class="btn btn-sm btn-success" @click="closeFilterDialog()">确定</button>
          </div>
        </div>
      </div>

      <div class="weui-cells__title">共享航班</div>
      <div class="weui-cells weui-cells_checkbox">
        <label class="weui-cell weui-check__label">
            <div class="weui-cell__hd">
              <input type="checkbox" title="选中则显示共享航班" class="weui-check" v-model="filter.showCodeShare">
                <i class="weui-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
                <p>显示共享航班</p>
            </div>
        </label>
      </div>  

      <div class="weui-cells__title">排序</div>
      <div class="weui-cells">
          <div class="weui-cell">
              <div class="weui-cell__hd">
                  <label for="" class="weui-label">排序</label>
              </div>
              <div class="weui-cell__bd">
                <select v-model="filter.sortBy" class="weui-select" >
                    <option value="0">起飞时间升序</option>
                    <option value="1">起飞时间降序</option>
                    <option value="2">最低价格升序</option>
                    <option value="3">最低价格降序</option>
                  </select>
              </div>
          </div>
      </div>

      <div class="weui-cells__title">航空公司筛选</div>
      <div class="weui-cells">
          <div class="weui-cell">
              <div class="weui-cell__hd">
                  <label for="" class="weui-label">航空公司</label>
              </div>
              <div class="weui-cell__bd">
                <select v-model="filter.filterByCarrier" class="weui-select" >
                        <option value="0">全部航司</option>
                        <template v-for="carrier in carrierInfos">
                            <option v-bind:value="carrier.code">
                                {{carrier.code}} {{carrier.name}}
                            </option>
                        </template>
                    </select>
              </div>
          </div>
      </div>

      <div class="weui-cells__title">起飞时间筛选</div>
      <div class="weui-cells">
          <div class="weui-cell">
              <div class="weui-cell__hd">
                  <label for="" class="weui-label">起飞时间</label>
              </div>
              <div class="weui-cell__bd">
                <select v-model="filter.filterByTime" class="weui-select" >
                        <option value="0">所有时间</option>
                        <option value="1">00:00-06:00</option>
                        <option value="2">06:01-12:00</option>
                        <option value="3">12:01-18:00</option>
                        <option value="4">18:00-23:59</option>
                    </select>
              </div>
          </div>
      </div>        
    </div>

    <div id="loadingToast" v-show="searching">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">数据加载中 {{dataLength}}</p>
      </div>
    </div>
  </div>
</template>

<script>
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
      searching: false,
      listShowing: true,
      detailShowing: false,
      filterModalShowing: false,
      flt: null,

      errMsg: '',
      errAlert: false,
      startPosition: -1,
      searchFlightResults: [],
      carriers: [],
      carrierInfos: [],
      filter: {
        showCodeShare: false,
        filterByCarrier: '0',
        filterByTime: '0',
        sortBy: 0
      },
      avCount: 0,
      totalCount: 0,
      showCount: 0,

      dataLength: 0
    }
  },
  computed: {
    dcity () { return this.$store.state.searchParams.dcity },
    acity () { return this.$store.state.searchParams.acity },
    ddate () { return this.$store.state.searchParams.ddate },
    dcityName () { return this.$store.state.searchParams.dcityName },
    acityName () { return this.$store.state.searchParams.acityName }
  },
  mounted: function () {
    this.avCount = 0
    this.search()
  },
  methods: {
    search: function () {
      var self = this

      if (self.dcity.length === 0) return;

      self.searching = true
      $.ajax({
        type: 'post',
        url: '/Flight/flights/rav',
        data: {
          'startPosition': self.startPosition,
          'dcity': self.dcity,
          'acity': self.acity,
          'ddate': self.ddate
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            if (jsonResult.status === -1) {
              self.showErrMsg('系统错误，请与管理员联系。')
              self.searching = false
              return
            }

            if (jsonResult.status === -2) {
              self.showErrMsg('免费查询额度用完。')
              self.searching = false
              return
            }

            if (jsonResult.dataList != null && jsonResult.dataList.length > 0) {
              var len1 = jsonResult.dataList.length
              self.dataLength = len1;
              for (var i = 0; i < len1; i++) {
                var flt = jsonResult.dataList[i]

                // 检查是否已经存在同样的航班号，如果存在，则比较彼此的ID，ID大的留着
                var len0 = self.searchFlightResults.length
                for (var j = 0; j < len0; j++) {
                  var flt0 = self.searchFlightResults[j]
                  if (flt0.flightNo === flt.flightNo) {
                    console.log(flt0.flightNo + ': ' + flt0.id + ', ' + flt.id)
                    self.searchFlightResults.splice(j, 1)
                    break
                  }
                }

                self.searchFlightResults.push(flt)

                if (self.startPosition < flt.id) {
                  self.startPosition = flt.id
                }

                if (self.carriers.length === 0 || self.carriers.indexOf(flt.carrierCode) === -1) {
                  self.carriers.push(flt.carrierCode)
                  self.carrierInfos.push({'code': flt.carrierCode, 'name': flt.carrierName})
                }
              }
            }

            if (jsonResult.status === 1) {
                // search done
              self.carriers.sort()
              self.carrierInfos.sort()
              self.searching = false
            } else if (jsonResult.status === 101) {
              self.searching = false
              self.showErrMsg('无直飞航班')
            } else {
              setTimeout(self.continueSearchFlight, 1500)
            }
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false
        },
        complete: function (XMLHttpRequest, textStatus) {
          // self.searching = false
        }
      })
    },
    continueSearchFlight: function () {
      if (this.startPosition === -1) {
        this.startPosition = 0
      }

      this.avCount = this.avCount + 1
      if (this.avCount >= 30) return

      this.search()
    },
    showFlightDetail: function (fltInfo) {
      // 显示某一航班详情
      //console.log(fltInfo)
      this.listShowing = false
      this.detailShowing = true
      // this.filterModalShowing = false
      this.flt = fltInfo
      // console.log(fltInfo)
    },
    closeDetail: function () {
      this.detailShowing = false
      // this.filterModalShowing = false
      this.listShowing = true
    },
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    execSort: function (searchResults) {
      var data = this.filter
      var returnFlights = searchResults.filter(function (flight) {
        if (data.showCodeShare) {
          return true
        } else {
          if (flight.codeShared === '0') {
            return true
          } else {
            return false
          }
        }
      })

      returnFlights = returnFlights.filter(function (flight) {
        if (data.filterByCarrier === '0' || data.filterByCarrier === flight.carrierCode) {
          return true
        } else {
          return false
        }
      })

      returnFlights = returnFlights.filter(function (flight) {
        switch (data.filterByTime) {
          case '0': return true
          case '1': return flight.depTime >= '0000' && flight.depTime <= '0600'
          case '2': return flight.depTime >= '0600' && flight.depTime <= '1200'
          case '3': return flight.depTime >= '1200' && flight.depTime <= '1800'
          case '4': return flight.depTime >= '1800' && flight.depTime <= '2359'
        }
      })

      this.totalCount = searchResults.length
      this.showCount = returnFlights.length

      if (data.sortBy === 0) {
        // 按照起飞时间的升序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return 1
          }
          if (a.depTime < b.depTime) {
            return -1
          }
          return 0
        })
      } else if (data.sortBy === 1) {
        // 按照起飞时间的降序
        returnFlights.sort(function (a, b) {
          if (a.depTime > b.depTime) {
            return -1
          }
          if (a.depTime < b.depTime) {
            return 1
          }
          return 0
        })
      } else if (data.sortBy === 2) {
        // 最低价格的升序
        returnFlights.sort(function (a, b) {
          var price0 = 1000000
          var price1 = 1000000
          if (a.lowestPrice != null) price0 = a.lowestPrice.price
          if (b.lowestPrice != null) price1 = b.lowestPrice.price

          return price0 - price1
        })
      } else if (data.sortBy === 3) {
        // 最低价格的降序
        returnFlights.sort(function (a, b) {
          var price0 = 0
          var price1 = 0
          if (a.lowestPrice != null) price0 = a.lowestPrice.price
          if (b.lowestPrice != null) price1 = b.lowestPrice.price

          return price1 - price0
        })
      }

      return returnFlights
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
    showCabinClass: function (cabinClass) {
      if (cabinClass === 'F') return '头等舱'
      else if (cabinClass === 'Y') return '经济舱'
      else if (cabinClass === 'C') return '商务舱'
      else return cabinClass
    },
    bookFlight: function (flightNo, ddate, subclass, dport, aport, dtime, atime, price, dportName, aportName, returnPoint) {
      var fltInfo = {}

      fltInfo.flightNo = flightNo
      fltInfo.ddate = ddate
      fltInfo.subclass = subclass
      fltInfo.dport = dport
      fltInfo.aport = aport
      fltInfo.dtime = dtime
      fltInfo.atime = atime
      fltInfo.price = price
      fltInfo.dportName = dportName
      fltInfo.aportName = aportName
      fltInfo.returnPoint = returnPoint

      this.$store.commit('addFlight', fltInfo)
      this.$router.replace('/booking')
    },
    back: function () {
      this.$router.go(-1)
    },
    showFilter: function () {
      this.filterModalShowing = true
      this.listShowing = false
    },
    closeFilterDialog: function () {
      this.filterModalShowing = false
      this.listShowing = true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
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
