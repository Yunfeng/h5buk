<template>
  <div id="book-form" class="row">
    <div class="col-12 bg-info text-center text-white sticky-top">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      <span class="fa-2">旅游预定</span>
    </div> 
    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title">{{detail.name}}</h4>    
          <p class="small">
            出发地: <span class="text-info">{{detail.dcity}}</span> 
            &nbsp;&nbsp;
            出发日期: <span class="text-primary">{{ddate}}</span>
          </p>
          <p>
            <span class="small">余位数:</span>{{count}}
            <span class="small">产品单价:</span> <span class="text-danger">{{price}}</span> 
          </p>          
        </div>       
      </div>
    </template>     

    <!-- 表单 -->
    <form id="frmOrder" class="col-12 px-0">
      <input type="hidden" name="tripOrder.tripId" :value="id" />
      <input type="hidden" name="tripOrder.ddate" :value="ddate" />
        <div class="card bg-warning text-white">
          <div class="card-block py-0">
            <span>游客信息</span>
          </div>
        </div>
        <div class="card px-0 col-12" v-for="(psg, index) in psgInfos">
            <div class="card-block p-0 mt-1">
              <span class="text-faded"><small>游客 {{index+1}}</small></span>
              <a href="javascript:void(0)" @click.stop="deletePsg(index)" class="float-right">
                <i class="fa fa-times text-danger" aria-hidden="true"></i>
              </a>
            </div>

            <div class="card-block" style="padding: 0">
              <div class="form-group border-bottom-1">
                <input type="text" class="form-control border-0" :name="'tripOrder.passengers[' + index + '].psgName'" placeholder="游客姓名" v-model="psg.psgName"/>
              </div>
              <div class="form-group border-bottom-1">
                <input type="text" class="form-control border-0" :name="'tripOrder.passengers[' + index + '].idNo'" placeholder="证件号" v-model="psg.idNo" />
              </div>
              <div class="form-group border-bottom-1">
                <select class="form-control border-0" :name="'tripOrder.passengers[' + index + '].idType'" v-model="psg.idType">
                <option v-for="item in idTypes" :value="item.idType">
                  {{ item.idName }}
                </option>
              </select>
              </div>

            </div>
        </div>

      <div class="col-12 card">
        <div class="card-block px-0 pb-1">
            <button type="button" @click.stop="addPsg()" class="btn btn-sm btn-outline-primary">
              <small>添加游客</small>
            </button>
          </div>
      </div>

      <div class="card col-12 bg-white border-0 mt-1 px-0">
        <div class="card-header bg-warning text-white py-0">
            <span>联系人信息</span>
          </div>
        <div class="card-block px-0">
          <div class="form-group border-bottom-1">
            <input type="text" class="form-control border-0" name="tripOrder.linkMan" placeholder="联系人"/>
          </div>
          <div class="form-group border-bottom-1">
            <input type="text" class="form-control border-0" name="tripOrder.linkPhone" placeholder="联系电话"/>
          </div>
          <div class="form-group border-bottom-1 mb-0">
            <input type="text" class="form-control border-0" name="tripOrder.remark" placeholder="备注" />
          </div>
        </div>   
      </div>

      <div class="card col-12 border-0">
        <div class="card-block">
          <a class="btn btn-success btn-block text-white" @click.stop="createTripOrder();">保存订单</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import $ from 'jquery'
import { getTripDetail } from '../api/trip.js'

export default {
  data () {
    return {
      id: 0,
      ddate: '',
      price: 0,
      count: 0,
      detail: null,

      idTypes: [
        { idType: 1, idName: '身份证' },
        { idType: 2, idName: '护照' },
        { idType: 10, idName: '其它' }
      ]
    }
  },
  computed: {
    psgInfos () { return this.$store.state.order.psgs }
  },
  mounted: function () {
    this.id = parseInt(this.$route.params.id)
    this.ddate = this.$route.params.ddate
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

            for (let i = 0; i < this.detail.priceInfos.length; i++) {
              const info = this.detail.priceInfos[i]
              // console.log(info.ddate + ', ' + this.ddate)
              if (info.ddate === this.ddate) {
                this.price = info.price
                this.count = info.count
                break
              }
            }
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    addPsg: function () {
      this.$store.commit('addPsg')
    },
    deletePsg: function (index) {
      this.$store.commit('deletePsg', index)
    },
    createTripOrder: function () {
      var self = this

      self.showLoading()

      $.ajax({
        type: 'post',
        url: '/Flight/trip/order/create',
        data: $('#frmOrder').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status !== 'OK') {
            self.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            // 清空预定信息
            self.$store.commit('resetOrderInfo')
            // self.showErrMsg(jsonResult.errmsg)
            self.$router.replace('/trip-orders')
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.hideLoading()
        }
      })
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
