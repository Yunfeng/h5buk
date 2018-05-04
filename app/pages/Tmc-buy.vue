<template>
  <div id="book-form" class="row">
    <div class="col-12 bg-info text-center text-white sticky-top">
      <span @click="back()" class="float-left fa-2">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      <span class="fa-2">采购</span>
    </div> 

    <div class="card col-12" v-if="editing === false">      
      <div class="card-body py-0">
        <div class="form-group">
          <textarea class="form-control" rows="12" v-model.trim="pnrDetail" placeholder="请将编码内容粘帖到此处"></textarea>
          <button type="button" class="btn btn-primary btn-sm mt-1" :disabled="btnDisabled" @click.stop="processPnrDetail();">导入编码内容</button>
          <button type="button" class="btn btn-info  btn-sm mt-1 float-right" @click.stop="inputPnr()">手工录入</button> 
        </div>
      </div>
    </div>

    <div class="card col-12" v-else-if="pnr !== null && editing">
      <div class="card-body bg-info text-white py-1" v-if="policyId > 0">政策</div>
      <table class="table table-sm small" v-if="policyId > 0">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位</th>
                <th>返点</th>
                <th>票面</th>
                <th class="d-none">备注</th>
            </tr>                        
        </thead>
        <tbody>
            <tr>
                <td>{{policyDetail.carrier}}</td>
                <td>{{policyDetail.subclass}}</td>
                <td>{{policyDetail.returnPoint}}</td>
                <td>{{policyDetail.minPrice}}</td>
                <td class="d-none">{{policyDetail.remark}}</td>
            </tr>
        </tbody>
      </table>   

      <div class="card-body bg-secondary text-white py-1">行程信息</div>
      <table class="table table-sm small">
        <thead>
          <tr>
            <th>航班号</th>
            <th>出发日期</th>
            <th>舱位</th>
            <th>出发机场</th>
            <th>到达机场</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info, index) in pnr.flights">
            <td>
              <input type="text" class="form-control form-control-sm" maxlength="7" size="15" placeholder="航班号" v-model.trim="info.flight.flightNo" /></td>
            <td>
              <input type="text" class="form-control form-control-sm" maxlength="10" size="18" placeholder="格式:2018-10-01" v-model.trim="info.flight.departureDate" /></td>
            <td>
              <input type="text" class="form-control form-control-sm" maxlength="2" size="5" v-model.trim="info.flight.subclass" /></td>
            <td>
              <input type="text" class="form-control form-control-sm" maxlength="3" placeholder="机场代码" v-model.trim="info.flight.departureAirport" size="10" />
            </td>
            <td>
              <input type="text" class="form-control form-control-sm" maxlength="3" placeholder="机场代码" v-model.trim="info.flight.arrivalAirport" size="10" />
            </td>
            <td>
              <a href="javascript:void(0)" @click.stop="deletePnrFlt(index)"  class="btn btn-sm btn-danger">-</a>
            </td>                
          </tr>
        </tbody>
      </table>
      <div class="card-body py-1">
        <a href="javascript:void(0);" @click.stop="addPnrFlt()" class="btn btn-sm btn-success">增加航段</a>
      </div>



      <div class="card-body bg-secondary text-white py-1">乘机人信息</div>                  
      <table class="table table-sm mb-0">
        <thead>
        <tr class="small">
            <th>姓名</th>
            <th>证件号</th>
            <th>证件类型</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in pnr.passengers">
            <tr>
              <td>  
                <input type="text" class="form-control form-control-sm" placeholder="乘机人姓名" v-model.trim="info.psgName"/>
              </td>
              <td>
                  <input type="text" class="form-control  form-control-sm" placeholder="证件号" v-model.trim="info.idNo" />
              </td>
              <td>
                  <select class="form-control form-control-sm" v-model.number="info.idType" placeholder="证件类型">
                    <option value="1">身份证</option>
                    <option value="2">护照</option>
                    <option value="99">其它</option>
                  </select>
              </td>
              <td>
                <a href="javascript:void(0)" @click.stop="deletePnrPsg(index)"  class="btn btn-sm btn-danger float-right">-</a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="card-body py-1">
        <a href="javascript:void(0);" @click.stop="addPnrPsg()" class="btn btn-sm btn-success">增加乘机人</a>
      </div>                  


      <div class="card-body bg-secondary text-white py-1">订票人</div>
      <div class="card-body py-1">
        <div class="form-group row mb-1">
          <label class="col-2 control-label text-right">姓名</label>
          <div class="col-8">
              <input type="text" class="form-control form-control-sm" v-model.trim="linkman">
          </div>
        </div>
        <div class="form-group row mb-1">
          <label class="col-2 control-label text-right">电话</label>
          <div class="col-8">
              <input type="text" class="form-control form-control-sm" v-model.trim="linkPhone">
          </div>
        </div>
        <div class="form-group row mb-1">
          <label class="col-2 control-label text-right">备注</label>
          <div class="col-8">
              <input type="text" class="form-control form-control-sm" v-model.trim="memo">
          </div>
        </div>
      </div>




      <div class="card-footer text-center">
        <button type="button" class="btn btn-primary" :disabled="btnDisabled" @click.stop.prevent="createFlightOrder()">保存</button>
      </div>
    </div>
      
  </div>
</template>

<script>
  import { processPnrDetail, createFlightOrder } from '../api/flight.js'

  import $ from 'jquery'

  export default {
    data () {
      return {
        editing: false,
        pnrDetail: '',
        pnr: null,

        memo: '',
        linkman: '',
        linkPhone: '',

        inputMode: 0,

        btnDisabled: false
      }
    },
    computed: {
      policyId () { return this.$store.state.policyIdSelected },
      policyDetail () { return this.$store.state.policyDetail }
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
      processPnrDetail: function () {
        if (this.pnrDetail.length === 0) {
          this.showErrMsg('编码内容不能为空')
          return
        }
        this.btnDisabled = true
        const params = { 'pnrDetail': this.pnrDetail }

        processPnrDetail(params,
          v => {
            this.pnr = v
            console.log(v)

            this.inputMode = 0
            this.editing = true
          },
          () => { this.btnDisabled = false }
        )
      },
      createFlightOrder: function () {
        const tempFlights = []
        for(let v of this.pnr.flights) {
          tempFlights.push(v.flight)
        }

        const params = {
          'pnrNo': this.pnr.pnrNo,
          'pnrDetail': this.pnrDetail,
          'policyId': this.policyId,
          'policyReturnPoint': this.policyDetail.returnPoint,
          'linkman': this.linkman,
          'linkPhone': this.linkPhone,
          'flights': tempFlights,
          'passengers': this.pnr.passengers
        }

        const jsonParams = JSON.stringify(params)

        this.showLoading('保存中')

        createFlightOrder(jsonParams, 
          v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.$router.push('/order/' + v.returnCode)
            }
          },          
          () => { this.hideLoading() }
        )
      },
      deletePnrTicket: function (index) {
        this.pnr.tickets.splice(index, 1)
      },
      deletePnrPsg: function (index) {
        this.pnr.passengers.splice(index, 1)
      },
      deletePnrFlt: function (index) {
        this.pnr.flights.splice(index, 1)
      },
      inputPnr: function () {
        this.inputMode = 1
        this.pnr = {
          flights: [],
          passengers: []
        }
        this.addPnrFlt()
        this.addPnrPsg()

        this.editing = true
      },
      addPnrFlt: function () {
        this.pnr.flights.push({
          'flight': {
            'flightNo': '',
            'departureDate': '',
            'subclass': '',
            'departureAirport': '',
            'departureTerminal': '',
            'arrivalAirport': '',
            'arrivalTerminal': '',
            'departureTime': '',
            'arrivalTime': ''
          }
        })
      },
      addPnrPsg: function () {
        this.pnr.passengers.push({ 'selected': true, 'psgName': '', 'idNo': '', 'idType': '', mobile: '' })
      },
      reset: function () {
        // body...
        this.pnrDetail = ''
        this.pnr = null

        this.inputMode = 0
      }
    }
  }
  // 585
</script>