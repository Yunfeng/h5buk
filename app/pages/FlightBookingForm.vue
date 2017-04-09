<template>
  <div id="book-form" class="row">
    <div class="col-12 bg-info text-center text-white">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      <span class="fa-2">机票预定</span>
    </div> 

    <!-- 航班信息 -->
    <div class="card col-12 px-0 border-0 ">
      
      <div class="card-block pt-0 px-0" v-for="(flt, index) in bookFlights">
        <div class="d-flex flex-row justify-content-between">
          <div>
            <span class="ml-2 small text-info">行程{{index+1}}</span>
          </div>
          <div>
            <span class="text-danger mr-2">
              <a href="javascript:void(0)"  @click.stop="removeFlightInfo(index)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </a>
            </span>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-around bg-faded">
            <div class="fa-2 text-success">{{flt.dportName}}</div>
            <div class="fa-2 text-danger"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></div>
            <div class="fa-2 text-muted">{{flt.aportName}}</div>
        </div>
        <div class="d-flex flex-row justify-content-around">
            <div class="fa-2 text-success">{{flt.ddate}}</div>
            <div class="fa-2 text-success">{{flt.showDtime}}</div>
            <div class="fa-2 text-muted">{{flt.showAtime}}</div>
        </div>

        <div class="d-flex flex-row justify-content-around bg-faded">
            <div class="fa-2 text-success">
              {{flt.flightNo}}
            </div>
            <div class="fa-2 text-faded">
              {{flt.subclass}}
            </div>
            <div class="fa-2">
              <span class="text-danger">
                <i class="fa fa-rmb text-warning"></i> {{flt.price}}
              </span>
            </div>
        </div>
      </div>
    </div>
    <div class="col-12 m-1 text-center" v-if="fltCount === 1">
      <a href="javascript:void(0)" @click.stop="searchReturn()" class="btn btn-warning w-75">搜索返程</a>
    </div>
    <!-- 表单 -->
    <form id="frmOrder" class="col-12 px-0">
      <input type="hidden" name="tmcPolicyApply.policyId" :value="policyId" />
      <input type="hidden" name="tmcPolicyApply.ticketAmount" value="0" />
      <template v-for="(fltInfo, index) in bookFlights">
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].flightNo'" :value="fltInfo.flightNo" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].departureDate'" :value="fltInfo.ddate" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].subclass'" :value="fltInfo.subclass" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].departureAirportName'" :value="fltInfo.dportName" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].departureAirport'"  :value="fltInfo.dport" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].arrivalAirportName'" :value="fltInfo.aportName" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].arrivalAirport'" :value="fltInfo.aport" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].departureTime'" :value="fltInfo.dtime"  />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].arrivalTime'" :value="fltInfo.atime" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].price'" :value="fltInfo.price" />
        <input type="hidden" :name="'tmcPolicyApply.flights[' + index + '].returnPoint'" :value="fltInfo.returnPoint" />
      </template>


        <div class="card card-outline-inf col-12 mt-1" v-for="(psg, index) in psgInfos">
            <div class="card-block p-0">
              <span class="text-faded"><small>乘客 {{index+1}}</small></span>
              <button type="button" @click.stop="selectPsg(index)" title="搜索并选择乘机人">
                <i class="fa fa-search-plus text-success" aria-hidden="true"></i>
              </button> 
              <a href="javascript:void(0)" @click.stop="deletePsg(index)" class="float-right">
                <i class="fa fa-times text-danger" aria-hidden="true"></i>
              </a>
            </div>

            <div class="card-block" style="padding: 0">
              <div class="form-group border-bottom-1">
                <input type="text" class="form-control border-0" :name="'tmcPolicyApply.passengers[' + index + '].psgName'" placeholder="乘客姓名" v-model="psg.psgName"/>
              </div>
              <div class="form-group border-bottom-1">
                <input type="text" class="form-control border-0" :name="'tmcPolicyApply.passengers[' + index + '].idNo'" placeholder="证件号" v-model="psg.idNo" />
              </div>
              <div class="form-group border-bottom-1">
                <select class="form-control border-0" :name="'tmcPolicyApply.passengers[' + index + '].idType'" v-model="psg.idType">
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
              <small>添加乘客</small>
            </button>
          </div>
      </div>


      <div class="card col-12 bg-white border-0">
        <div class="card-block px-0">
          <div class="form-group border-bottom-1">
            <input type="text" class="form-control border-0" name="tmcPolicyApply.linkPhone" placeholder="联系电话"/>
          </div>
          <div class="form-group border-bottom-1 mb-0">
            <input type="text" class="form-control border-0" name="tmcPolicyApply.remark" placeholder="备注" />
          </div>
        </div>   
      </div>

      <div class="card col-12">
        <div class="card-block">
          <a class="btn btn-success btn-block text-white" @click.stop="createFlightOrder();">保存订单</a>
        </div>
      </div>
    </form>

    <div class="clear"></div>
    <my-psg-picker :show="showPicker" @close="psgPickerClosed"></my-psg-picker>

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
import { addDate } from '../common/common.js'
import MyPsgPicker from '../components/my-psg-picker.vue'
import $ from 'jquery'

export default {
  components: {
    'my-psg-picker': MyPsgPicker
  },
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: '数据加载中',

      psgSelected: -1,

      idTypes: [
        { idType: 1, idName: '身份证' },
        { idType: 2, idName: '护照' },
        { idType: 10, idName: '其它' }
      ],
      showPicker: false
    }
  },
  computed: {
    bookFlights () { return this.$store.state.order.flights },
    psgInfos () { return this.$store.state.order.psgs },
    policyId () { return this.$store.state.order.policyId },
    ddate () { return this.$store.state.searchParams.ddate },
    fltCount () { return this.bookFlights.length }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    addPsg: function () {
      this.$store.commit('addPsg')
    },
    deletePsg: function (index) {
      this.$store.commit('deletePsg', index)
    },
    removeFlightInfo: function (index) {
      this.$store.commit('deleteFlt', index)
      if (this.bookFlights.length === 0) {
        this.$router.replace('/search')
      }
    },
    createFlightOrder: function () {
      var self = this

      self.loading = true
      self.loadingText = '保存中...'

      $.ajax({
        type: 'post',
        url: '/Flight/orders/createFlightOrder',
        data: $('#frmOrder').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status !== 'OK') {
            self.showErrMsg(jsonResult.errmsg, 'danger')
          } else {
            // 清空预定信息
            self.$store.commit('resetOrderInfo')

            self.$store.commit('setOrderId', jsonResult.returnCode)
            self.$router.push('/order/detail/' + jsonResult.returnCode)
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
    },
    selectPsg: function (index) {
      this.psgSelected = index
      this.showPicker = true
    },
    psgPickerClosed: function (status, name, idType, idNo) {
      this.showPicker = false
      if (status === 1) {
        this.$store.commit('updatePsg', { 'index': this.psgSelected, 'name': name, 'idType': idType, 'idNo': idNo })
      }
    },
    searchReturn: function () {
      this.$store.commit('switchCity')

      var newDate = addDate(this.ddate, 1)
      this.$store.commit('setDdate', newDate)
      this.$router.push('/search')
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
