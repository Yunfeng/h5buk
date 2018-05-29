<template>  
	<div id="article-detail" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      线路介绍
    </div>

    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title">{{detail.name}}</h4>    
          出发地：{{detail.dcity}}<br />
          目的地：{{detail.acity}}<br />
          购买链接：<a :href="detail.buyUrl" target="_blank">{{detail.buyUrl}}</a><br />
          联系购买：{{detail.buyContact}}<br />
        </div>       
        <span class="bg-faded text-center text-muted"></span>
        
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div class="card">
            <div class="card-header" role="tab" id="headingTripTwo">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTripTwo" aria-expanded="false" aria-controls="collapseTripTwo">
                  行程特色
                </a>
              </h5>
            </div>
            <div id="collapseTripTwo" class="collapse" role="tabpanel" aria-labelledby="headingTripTwo">
              <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header" role="tab" id="headingTripThree">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTripThree" aria-expanded="false" aria-controls="collapseTripThree">
                  每日行程
                </a>
              </h5>
            </div>
            <div id="collapseTripThree" class="collapse" role="tabpanel" aria-labelledby="headingTripThree">
              <table class="table">
                  <thead>
                    <tr><th></th><th></th><th></th></tr>
                  </thead>
                  <tbody>
                    <template v-for="dayInfo in detail.dayInfos">
                      <tr>
                        <td>{{dayInfo.day}}</td>
                        <td>
                          {{dayInfo.currentStop}} 
                          <template v-if="dayInfo.nextStop">
                            - {{dayInfo.nextStop}}
                          </template>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-danger" @click.stop="delDayInfo(dayInfo.id)">删除</button></td>
                      </tr>
                      <tr>
                        <td colspan="3"><span v-html="dayInfo.content"></span></td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-center">
                          <span v-if="dayInfo.breakfast">含早餐</span>
                          <span v-if="dayInfo.lunch">含午餐</span>
                          <span v-if="dayInfo.supper">含晚餐</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-center">
                          <span v-if="dayInfo.accommodation">住宿：{{dayInfo.accommodation}}</span>
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td colspan="3" class="text-right">
                        <button class="btn btn-sm btn-success" @click.stop="addDayInfo(detail.id)">增加日程安排</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
          <div class="card">
            <div class="card-header" role="tab" id="headingTripPrice">
              <h5 class="mb-0">
                <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTripPrice" aria-expanded="false" aria-controls="collapseTripPrice">
                  价格
                </a>
              </h5>
            </div>
            <div id="collapseTripPrice" class="collapse" role="tabpanel" aria-labelledby="headingTripPrice">
              <table class="table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>成人价</th>
                      <th>儿童价</th>
                      <th>数量</th>
                      <th>提前天数</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="info in detail.priceInfos">
                      <tr>
                        <td>{{info.ddate}}</td>
                        <td>
                          {{info.price}} 
                        </td>
                        <td>
                          {{info.childPrice}} 
                        </td>
                        <td>
                          {{info.count}} 
                        </td>
                        <td>
                          {{info.advanceDays}} 
                        </td>
                        <td>
                          <button class="btn btn-sm btn-danger" @click.stop="delPriceInfo(info.id)">删除</button>
                          </td> 
                      </tr>
                    </template>
                    <tr>
                      <td colspan="3" class="text-right">
                        <button class="btn btn-sm btn-success" @click.stop="addPriceInfo(detail.id)">录入价格</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>
        </div>        
        
        <ul class="list-group list-group-flush">
          <li class="list-group-item">创建时间: {{formatDateTime(detail.createTime)}}</li>
          <li class="list-group-item">修改时间: {{formatDateTime(detail.lastupdate)}}</li>
        </ul>
        <div class="card-footer">
          <button class="btn btn-block btn-primary" @click.stop="edit(detail.id)">修改</button>
        </div>
      </div>
    </template>     
  </div>
</template>

<script>
import { getTripDetail, delTripDayInfo, delTripPriceInfo } from '../../api/trip.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
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
  updated: function () {
    // this.addImgFluid()
    // this.bindCarousel()
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
    edit: function (id) {
      var path = '/trip/edit/' + id
      this.$router.push(path)
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    addDayInfo: function (id) {
      var path = '/trip/' + id + '/day'
      this.$router.push(path)
    },
    addPriceInfo: function (id) {
      var path = '/trip/' + id + '/price'
      this.$router.push(path)
    },
    delDayInfo: function (id) {
      if (window.confirm('确定删除此日行程安排 吗？') === false) {
        return
      }

      this.showLoading()

      delTripDayInfo(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.refreshTripDetail(this.id)
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    delPriceInfo: function (id) {
      // if (window.confirm('确定删除此日价格 吗？') === false) {
      //   return
      // }

      this.showLoading()

      delTripPriceInfo(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.refreshTripDetail(this.id)
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
      window.scroll(0, 0)
    })
  }
}
</script>
