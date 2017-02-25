<template>
	<div id="order-detail" class="container">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <template v-if="info !== null">

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          订单详情 <small>({{info.id}})</small>
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 


    <div class="weui-cells">
      <div class="weui-cell bg-warning">
        <span>订单金额</span>
        <div class="weui-cell__bd text-right text-white">
          <i class="fa fa-rmb"></i>{{info.totalPrice}}
        </div>
      </div>
    </div>
    <div class="weui-cells__title">
      行程信息
    </div>
    <div class="weui-cells" style="font-size: 15px">
      <template v-for="flt in info.flights">
        <dl class="row">
          <dt class="col-3 text-right">出发到达</dt>
          <dd class="col-9">{{flt.departureAirportName}} - {{flt.arrivalAirportName}}</dd>

          <dt class="col-3 text-right">起飞时间</dt>
          <dd class="col-9">{{flt.departureDate}} {{flt.departureTime}}</dd>
          <dt class="col-3 text-right">到达时间</dt>
          <dd class="col-9">{{flt.arrivalDate}} {{flt.arrivalTime}}</dd>

          <dt class="col-3 text-right">航班</dt>
          <dd class="col-9">{{flt.flightNo}}  {{flt.subclass}}</dd>
          <dt class="col-3 text-right">价格</dt>
          <dd class="col-9">{{flt.price}}</dd>
        </dl>
      </template> 
    </div>
    <div class="weui-cells__title">
      乘机人信息
    </div>
    <div class="weui-cells" style="font-size: 15px">
      <template v-for="psg in info.passengers">
        <dl class="row">
          <dt class="col-3 text-right">姓名</dt>
          <dd class="col-9">{{psg.psgName}}</dd>

          <dt class="col-3 text-right">证件号</dt>
          <dd class="col-9">{{psg.idNo}}</dd>

          <dt class="col-3 text-right">证件类型</dt>
          <dd class="col-9">{{showIdTypeDesc(psg.idType)}}</dd>
          <dt class="col-3 text-right">票号</dt>
          <dd class="col-9 text-right"><strong>{{psg.ticketNo}}</strong></dd>
        </dl>
      </template>

      <dl class="row">
        <dt class="col-3 text-right">生成时间</dt>
        <dd class="col-9">
          <p>{{convertLongToTimeDesc(info.createTime)}}</p>
        </dd>
        <dt class="col-3 text-right">订单状态</dt>
        <dd class="col-9">
          <p>{{showStatusDesc(info.status)}}</p>
        </dd>
      </dl>
    </div>
    

    <template v-if="info.policyId >= 0">
      <!-- 普通订单 -->
      <template v-if="info.status === 1024 && info.enterpriseId > 0">
        <div class="weui-btn-area">
          <button type="button" class="weui-btn weui-btn_primary" @click="commitTmcOrder(info.id)">提交出票</button>
          <button type="button" class="weui-btn weui-btn_warn" @click="cancelTmcOrder(info.id)">取消</button>
        </div>
      </template>

      <template v-if="info.status === 1  && info.enterpriseId > 0">
        <div class="weui-cells__title">
          结算信息
        </div>
        <div class="weui-cells" style="font-size: 15px">
          <dl class="row">
            <dt class="col-3 text-right">原价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.totalPrice}}</p>
            </dd>
            <dt class="col-3 text-right">开票价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.ticketAmount}}</p>
            </dd>
            <dt class="col-3 text-right">服务费：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.serviceFee}}</p>
            </dd>
            <dt class="col-3 text-right">节省费用</dt>
            <dd class="col-9 text-right text-danger">
              <strong><i class="fa fa-rmb"></i>{{costSaving}}</strong>
            </dd>
          </dl>
        </div>
        <div class="weui-btn-area">
          <button type="button" class="weui-btn weui-btn_primary" @click="payForTmcOrder(info.id)">支付</button>

          <button type="button" class="weui-btn weui-btn_warn" @click="cancelTmcOrder(info.id)">取消</button>
        </div>
      </template>
      <template v-if="info.status === 4  && info.enterpriseId > 0">
        <div class="weui-cells__title">
          拒单说明
        </div>
        <div class="weui-cells" style="font-size: 15px">
          <dl class="row">
            <dt class="col-3 text-right">拒单理由</dt>
            <dd class="col-9">
              <p>{{info.denyReason}} <small>({{info.denyCode}})</small></p>
            </dd>
          </dl>
        </div>
        <template v-if="info.denyCode == 401 || info.denyCode == 402">
          <div class="weui-btn-area">
            <button type="button" class="weui-btn weui-btn_primary" @click="recommitTmcOrder()">重新提交</button>
          </div>
        </template>
      </template>
      <template v-if="info.status === 16  && info.enterpriseId > 0">
        <div class="weui-cells__title">
          结算信息
        </div>
        <div class="weui-cells" style="font-size: 15px">
          <dl class="row">
            <dt class="col-3 text-right">原价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.totalPrice}}</p>
            </dd>
            <dt class="col-3 text-right">开票价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.ticketAmount}}</p>
            </dd>
            <dt class="col-3 text-right">服务费：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.serviceFee}}</p>
            </dd>
            <dt class="col-3 text-right">节省费用</dt>
            <dd class="col-9 text-right text-danger">
              <strong><i class="fa fa-rmb"></i>{{costSaving}}</strong>
            </dd>
          </dl>
        </div>
        <div class="weui-btn-area">
          <button type="button" class="weui-btn weui-btn_primary" @click="confirmOrderTicketRight(info.id)">票号正确 ({{ticketCorrectConfirmTimes}})</button>

          <button type="button" class="weui-btn weui-btn_warn" @click="confirmOrderTicketWrong(info.id)">票号有误 ({{ticketWrongConfirmTimes}})</button>
        </div>
      </template>
      <template v-if="info.status === 8  && info.enterpriseId === 0 && info.seller > 0">
        <div class="weui-cells__title">
          结算信息
        </div>
        <div class="weui-cells" style="font-size: 15px">
          <dl class="row">
            <dt class="col-3 text-right">原价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.totalPrice}}</p>
            </dd>
            <dt class="col-3 text-right">开票价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.ticketAmount}}</p>
            </dd>
          </dl>
        </div>
        <div class="weui-btn-area">
          <button type="button" class="weui-btn weui-btn_primary" @click="toTicketTmcOrder(info.id);">我来开票</button>
          <button type="button" class="weui-btn weui-btn_warn" @click="denyTmcOrder(info.id);">拒绝</button>
        </div>
      </template>
      <template v-if="info.status === 12  && info.enterpriseId === 0 && info.seller > 0">
        <div class="weui-cells__title">
          结算信息
        </div>
        <div class="weui-cells" style="font-size: 15px">
          <dl class="row">
            <dt class="col-3 text-right">原价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.totalPrice}}</p>
            </dd>
            <dt class="col-3 text-right">返点：</dt>
            <dd class="col-9">
              <p>{{info.policyReturnPoint}}</p>
            </dd>
            <dt class="col-3 text-right">开票价：</dt>
            <dd class="col-9">
              <p><i class="fa fa-rmb"></i>{{info.ticketAmount}}</p>
            </dd>
          </dl>
        </div>
        <div class="weui-btn-area">
          <button type="button" class="weui-btn weui-btn_primary" @click="fillTicketNo(info.id);">填写票号</button>
          <button type="button" class="weui-btn weui-btn_warn" @click="denyTmcOrder(info.id);">拒绝</button>
        </div>
      </template>

    </template>
    <template v-if="info.policyId === -1 && info.status !== 128 && info.enterpriseId > 0">      
      <div class="weui-cells__title">
      候选政策
      </div>
      <table class="table table-striped table-condensive">
        <thead>
            <tr>
                <th>航司</th>
                <th>舱位</th>
                <th>返点</th>
                <th>最低票面</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in policies" @click="showPolicyDetail(info)">
                <td>{{info.carrier}}</td>
                <td>{{info.subclass}}</td>
                <td>{{info.returnPoint}}</td>
                <td>{{info.minPrice}}</td>
                <td><button class="btn btn-success btn-xs" @click.stop="selectPolicy(info)">选择</button></td>
            </tr>
        </tbody>
      </table>
      <div class="weui-cells__title">结算信息</div>
      <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd"><label class="weui-label">应付票款</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" type="number" pattern="[0-9]*" v-model="ticketAmount" placeholder="请输入整数">
                </div>
            </div>
            <div class="weui-cells__tips">用FD正价扣除返点，保留到元，不要分和角。含机场税，不含平台服务费。</div>
            <div class="weui-cell">
                <div class="weui-cell__hd"><label for="" class="weui-label">备注</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" value="" v-model="remark">
                </div>
            </div>
      </div>
      <div class="weui-form-preview">
          <div class="weui-form-preview__bd">
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">票款</label>
                  <span class="weui-form-preview__value">{{ticketAmount}}</span>
              </div>
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">备注</label>
                  <span class="weui-form-preview__value">{{remark}}</span>
              </div>
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">返点</label>
                  <span class="weui-form-preview__value">{{returnPoint}}</span>
              </div>
              <div class="weui-form-preview__item">
                  <label class="weui-form-preview__label">返钱</label>
                  <span class="weui-form-preview__value">{{returnMoney}}</span>
              </div>
          </div>
      </div>
      <div class="weui-btn-area">
          <button class="weui-btn weui-btn_primary" @click="commitTmcPolicyOrder(info.id)">提交出票</button>
          <button class="weui-btn weui-btn_warn" @click="cancelTmcOrder(info.id)">取消</button>
        </div>
    </template>

    <!-- v-if info !=== null end -->
    </template> 

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
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'

export default {
  components:{
    'my-button': MyButton,
    'my-input': MyInput    
  },
  data () {
    return {
      errAlert: false,
      errMsg: "",
      loading: false,
      loadingText: "数据加载中",
      
      policies: [],

      ticketAmount: 0,
      remark: "",
      returnPoint: 0,
      returnMoney: 0,
      policyId: 0,
      ticketWrongConfirmTimes: 3,
      ticketCorrectConfirmTimes: 2
    }
  },
  computed: {
    info() {return this.$store.state.orderDetail},
    orderId() {return this.$store.state.orderId},
    psgCount() {
      if (this.$store.state.orderDetail == null) {
        return 0;
      } else {
        return this.$store.state.orderDetail.passengers.length;
      }
    },
    costSaving() {
      var info =  this.$store.state.orderDetail;
      return info.totalPrice - info.ticketAmount - info.serviceFee;
    }
  },
  mounted: function() {
    this.ticketWrongConfirmTimes = 3;
    this.ticketCorrectConfirmTimes = 2;

    if (this.info != null) {
      if (this.info.policyId === -1) {
        //search tmc policy
        this.searchPolicies();

        this.ticketAmount = this.info.totalPrice;
      }
    } else if (this.orderId > 0) {
      this.refreshOrderDetail(this.orderId);
    }
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    showErrMsg: function(msg) {
      this.errMsg = msg;
      this.errAlert = true;
      setTimeout(() => this.errAlert = false, 1500);
    },
    calc: function() {
      var price = this.info.flights[0].price;
      var psgCount = this.psgCount;

      this.ticketAmount = Math.round((price * (100 - this.returnPoint) / 100 - this.returnMoney + 50) * psgCount); 
    },
    searchPolicies: function() {
      var self = this;

      self.loading = true;
      self.loadingText = "政策查找中";
      
      var flightNo = self.info.flights[0].flightNo;
      var subclass = self.info.flights[0].subclass;
      var dport = self.info.flights[0].departureAirport;

      var carrier = flightNo.substring(0, 2);

      $.ajax({
          type : "post",
          url : "/Flight/policies/",
          data: {
            "sc.pageNo": 1,
            "sc.pageSzie": 5,
            "sc.policyType": -1,
            "sc.intlPolicy": -1,
            "sc.searchMode": 0,
            "sc.carrier": carrier,
            "sc.subClass": subclass,
            "sc.dport": dport
          },
          dataType: "json",
          success : function(jsonResult) {
              if (jsonResult !== null) {
                self.policies = jsonResult.dataList;
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) { 
            self.searching = false;

            if (XMLHttpRequest.status === 403) {
              self.$store.commit('jumpToLogin', self.$router);
            }
          },
          complete: function (XMLHttpRequest, textStatus) {  
            self.loading = false;
          }  
      });      
    },
    selectPolicy: function(info) {
      this.returnPoint = info.returnPoint;
      this.returnMoney = info.returnMoney;
      this.policyId = info.id;
      this.calc();
      this.showErrMsg("选择成功");
    },
    showStatusDesc: function(status) {
      var desc = "";
      switch (status) {
        case 0: desc = "等待接单"; break;
        case 1: desc = "待支付"; break;
        case 2: desc = "付款确认中 "; break;
        case 4: desc = "已拒单"; break;
        case 8: desc = "等待开票"; break;
        case 12: desc = "开票中"; break;
        case 16: desc = "待确认票号"; break;
        case 32: desc = "待平台结算"; break;
        case 64: desc = "已完成"; break;
        case 128: desc = "已取消"; break;
        case 1024: desc = "未提交"; break;
        default:
          desc = status;
      }
      return desc;
    },
    showIdTypeDesc: function(idType) {
      var desc = "";
      switch (idType) {
        case "1": desc = "身份证"; break;
        case "2": desc = "护照"; break;
      }
      return desc;
    },
    showPolicyDetail: function(info) {
      this.$store.commit("setPolicyDetail", info);
      this.$router.push("/tmc/detail");      
    },
    convertLongToTimeDesc: function(l) {
      return this.getFormatDate(new Date(l));  
    },
    getFormatDate: function(date, pattern) {  
        if (date == undefined) {  
            date = new Date();  
        }  
        if (pattern == undefined) {  
            pattern = "yyyy-MM-dd hh:mm:ss";  
        }  
        return date.format(pattern);  
    },
    refreshOrderDetail: function(id) {
      if (id === undefined || id === null) {
        //console.log("id: " + id);
        id = this.orderId;
        //console.log("id: " + id);
      }

      var self = this;

      self.loading = true;
      self.loadingText = "订单刷新中......";

      //console.log("order is refreshing...");

      $.ajax({
          type : "post",
          url : "/Flight/orders/searchOrderDetail",
          data: {id: id},
          dataType: "json",
          success : function(jsonResult) {
              if (jsonResult !== null && jsonResult.id === id) {
                self.$store.commit('setOrderDetail', jsonResult);
                self.searchPolicies();

                self.ticketAmount = self.info.totalPrice;
              }
          },
          complete: function() {
            self.loading = false;
          }
      });
    },
    cancelTmcOrder: function(id) {
      //买家：取消订单
      var url = "/Flight/orders/cancelTmcOrder.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    commitTmcOrder: function(id) {
      //买家
      var url = "/Flight/orders/commitTmcOrder.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    commitTmcPolicyOrder: function(id) {
      // 提交大客户政策订单开票
      var url = "/Flight/orders/commitTmcPolicyOrder.do";
      var postData = {
            "id": id,
            "policyId": this.policyId,
            "ticketAmount": this.ticketAmount,
            "remark": this.remark
          };
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    payForTmcOrder: function(id) {
      //买家：支付订单
      var url = "/Flight/orders/payForTmcOrder.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    toTicketTmcOrder: function(id) {
      //卖家：我来开票
      var url = "/Flight/orders/toTicketForTmcOrder.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    denyTmcOrder: function(id) {
      this.$router.replace("/order/deny");
    },
    recommitTmcOrder: function() {
      this.$router.replace("/order/recommit");
    },
    fillTicketNo: function(id) {
      this.$router.replace("/order/ticket");
    },
    confirmOrderTicketWrong: function(id) {
      this.ticketWrongConfirmTimes--;
      if (this.ticketWrongConfirmTimes > 0) {
        console.log(this.ticketWrongConfirmTimes);
        return;
      }

      //买家：票号错误
      var url = "/Flight/orders/confirmOrderTicketWrong.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    confirmOrderTicketRight: function(id) {
      this.ticketCorrectConfirmTimes--;
      if (this.ticketCorrectConfirmTimes > 0) {
        console.log(this.ticketCorrectConfirmTimes);
        return;
      }

      //买家：票号正确
      var url = "/Flight/orders/confirmOrderTicketCorrect.do";
      var postData = {id: id};
      var successHandler = this.refreshOrderDetail;

      this.executeOrderOp(url, postData, successHandler);
    },
    executeOrderOp: function(url, postData, successHandler) {
      var self = this;

      self.loading = true;
      self.loadingText = "处理中......";

      var opResult = false;

      $.ajax({
          type : "post",
          url : url,
          data: postData,
          dataType: "json",
          success : function(jsonResult) {
            if (jsonResult.status == "OK") {
              self.showErrMsg("操作成功");
              opResult = true;
            } else {
              self.showErrMsg("操作失败： " + jsonResult.errmsg);
            }                            
          },
          complete: function() {
            self.loading = false;
            if (opResult) {
              successHandler();
            }
          }
      });
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}

</script>