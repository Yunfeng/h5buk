<template>
  <div id="book-form" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left text-white fa-2" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          机票预定 
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <!-- 航班信息 -->
    <div class="card">
      <div class="card-block" v-for="(flt, index) in bookFlights">
        <div class="weui-flex">
            <div class="weui-flex__item"><div class="text-center">{{flt.ddate}} {{flt.dtime}}</div></div>
        </div>
        <div class="weui-flex">
            <div class="weui-flex__item"><div class="text-center">{{flt.dportName}} 至 {{flt.aportName}}</div></div>
        </div>

        <div class="weui-flex">
            <div class="weui-flex__item text-center">
              {{flt.flightNo}}
            </div>
            <div class="weui-flex__item text-center">
              {{flt.subclass}}
            </div>
            <div class="weui-flex__item"><div class="text-right"><i class="fa fa-rmb"></i>{{flt.price}}</div></div>
            <div class="weui-flex__item">
              <div class="text-right text-danger">
                <a href="javascript:void(0)"  @click.stop="removeFlightInfo(index)">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
    <!-- 表单 -->
    <form id="frmOrder" class="form-horizontal">
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

      <div class="row" v-for="(psg, index) in psgInfos">
        <div class="card card-outline-inf col-12">
            <div class="card-block" style="padding: 0">
              {{index+1}} 
              <button type="button" @click.stop="selectPsg(index)" title="搜索并选择乘机人">
                <i class="fa fa-users" aria-hidden="true"></i>
              </button> 
              <a href="javascript:void(0)" @click.stop="deletePsg(index)" class="float-right">
                <i class="fa fa-times" aria-hidden="true"></i>
              </a>
            </div>

            <div class="card-block" style="padding: 0">
              <div class="form-group">
                <input type="text" class="form-control" :name="'tmcPolicyApply.passengers[' + index + '].psgName'" placeholder="乘机人姓名" v-model="psg.psgName"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" :name="'tmcPolicyApply.passengers[' + index + '].idNo'" placeholder="证件号" v-model="psg.idNo" />
              </div>
              <div class="form-group">
                <label>证件类型</label>
                <select class="form-control" :name="'tmcPolicyApply.passengers[' + index + '].idType'" v-model="psg.idType">
                <option v-for="item in idTypes" :value="item.idType">
                  {{ item.idName }}
                </option>
              </select>
              </div>

            </div>
        </div>
      </div>
      <div class="weui-flex">
        <div class="weui-flex__item">
          <div class="placeholder">
            <button type="button" @click="addPsg()" class="btn btn-xs btn-primary">
              <i class="fa fa-user-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="weui-btn-area">
              <a class="weui-btn weui-btn_primary text-white" @click="createFlightOrder();">保存订单</a>
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
        { idType: 2, idName: '护照' }
      ],
      showPicker: false
    }
  },
  computed: {
    bookFlights () { return this.$store.state.order.flights },
    psgInfos () { return this.$store.state.order.psgs },
    policyId () { return this.$store.state.order.policyId }
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
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
        url: '/Flight/orders/createFlightOrder.do',
        data: $('#frmOrder').serialize(),
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status !== 'OK') {
            self.showErrMsg(jsonResult.errmsg)
          } else {
            // 清空预定信息
            self.$store.commit('resetOrderInfo')

            self.$store.commit('setOrderId', jsonResult.returnCode)
            self.$router.push('/order/detail')
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
      // console.log('selectPsg: ' + this.psgSelected);
    },
    psgPickerClosed: function (status, name, idType, idNo) {
      this.showPicker = false
      // console.log(status);
      if (status === 1) {
        // console.log(name);
        // console.log(idType);
        // console.log(idNo);
        this.$store.commit('updatePsg', { 'index': this.psgSelected, 'name': name, 'idType': idType, 'idNo': idNo })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log('i m in.');
    })
  }
}
</script>
