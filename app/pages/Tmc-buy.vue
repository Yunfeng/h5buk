<template>  
	<div id="tmc-buy" class="container">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <div class=" text-info weui-cells__title">编码内容</div>
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <textarea class="weui-textarea" placeholder="请粘帖编码内容于此" rows="6" v-model="pnrDetail"></textarea>
                <div class="weui-textarea-counter hidden"><span>0</span>/200</div>
            </div>
        </div>
      </div>
      <div class="weui-cells__tips">若无编码内容，可直接<strong>下一步</strong>，然后手工录入</div>
      <div class="weui-btn-area">
            <button type="button" class="weui-btn weui-btn_primary" @click="nextStep()">下一步</button>
            <button type="button" class="weui-btn weui-btn_detail" @click="emptyPnrDetail()">清空</button>
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

export default {
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: "数据加载中",
      idTypes: [
        {idType: 1, idName: "身份证"},
        {idType: 2, idName: "护照"},
      ],
      

      pnrDetail: "",
      pnr: null

    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function() {
    // this.search();
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    emptyPnrDetail: function() {
      this.pnrDetail = "";
    },
    nextStep: function() {
        this.doJob0();
    },
    doJob0: function() {
      if (this.pnrDetail !== null && this.pnrDetail.length > 10) {
        var self = this;
        self.loading = true;
        self.loadingText = "编码内容处理中";

        $.ajax({
            type: "post",
            url: "/Flight/pnr/processPnrDetail",
            data: {pnrDetail: this.pnrDetail}, 
            dataType: "json",
            success: function(jsonResult) {
                if (jsonResult !== null) {
                  self.prepareOrder(jsonResult);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
              if (XMLHttpRequest.status === 403) {
                self.$store.commit('jumpToLogin', self.$router);
              }
            },
            complete: function (XMLHttpRequest, textStatus) {  
              self.loading = false;
            } 
        });  
      }
    },
    prepareOrder: function(jsonResult) {
      var length = jsonResult.passengers.length;
      for(var i = 0; i < length; i++) {
        var psg = jsonResult.passengers[i];

        var psgInfo = new Object();
        //p = {psgName:'', idNo: '', idType: 1};
        psgInfo.psgName = psg.psgName;
        psgInfo.idNo = psg.idNo;
        if (psg.idType === null || psg.idType === "NI"){
          psgInfo.idType = 1;
        } else {
          psgInfo.idType = 2;
        }

        this.$store.commit("addPsg", psgInfo);
      }

      length = jsonResult.flights.length;
      for(var i = 0; i < length; i++) {
        var flt = jsonResult.flights[i].flight;
      
        var fltInfo = new Object();

        fltInfo.flightNo = flt.flightNo;
        fltInfo.ddate = flt.departureDate;
        fltInfo.subclass = flt.subclass;
        fltInfo.dport = flt.departureAirport;
        fltInfo.aport = flt.arrivalAirport;
        fltInfo.dtime = flt.departureTime;
        fltInfo.atime = flt.arrivalTime;
        fltInfo.price = flt.price;
        fltInfo.dportName = flt.departureAirport;
        fltInfo.aportName = flt.arrivalAirport;
        fltInfo.returnPoint = 0;

        this.$store.commit("addFlight", fltInfo);
        // 
        // this.$store.commit("addPsg");
      }

      

      this.$store.commit("setOrderInfo", {
        "pnrNo": jsonResult.pnrNo, 
        "pnrDetail": jsonResult.pnrDetail,
        "policyId": -1});
      this.$router.replace("/booking");
    }
    
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      //console.log("i m in.");
      
    })
  }
}

</script>