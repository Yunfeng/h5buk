<template>  
	<div id="order-ticket" class="container">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>
    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>


    <div class="weui-cells__title text-center">拒单原由</div>
    <div class="weui-cells">
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
          <label for="" class="weui-label">理由分类</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select" v-model="denyCode">
            <option value="401">价格少算</option>
            <option value="402">外放无位，请授权</option>
            <option value="499">其它</option>
          </select>
        </div>
      </div>
      <div class="weui-cells__tips text-right">请准确选择</div>
      
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">理由说明</label></div>
        <div class="weui-cell__bd">
          <input type="text" class="weui-input" placeholder="拒绝理由详细说明" v-model="denyReason" />
        </div>
      </div>    
      <div class="weui-cells__tips text-right">必填，不多于50字</div>
    </div>
    <div class="weui-btn-area">
      <button type="button" class="weui-btn weui-btn_primary" @click.stop="denyOrder()">确定</button>
      <button type="button" class="weui-btn weui-btn_default" @click.stop="close()">取消</button>
    </div>



                
    
  </div>
</template>

<script>
import MyInput from '../components/my-input.vue'

export default {
  components:{
    'my-input': MyInput    
  },
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: "数据加载中",

      denyCode: 401,
      denyReason: ""
    }
  },
  computed: {
    info() {return this.$store.state.orderDetail},
    orderId() {return this.$store.state.orderId}
  },
  mounted: function() {
    //this.search();
  },
  methods: {
    close: function() {
      this.$router.go(-1);
    },
    showErrMsg: function(msg) {
      this.errMsg = msg;
      this.errAlert = true;
      setTimeout(() => this.errAlert = false, 1500);
    },
    denyOrder: function() {
      //卖家：拒单
      var url = "/Flight/orders/denyTmcOrder.do";
      var postData = {
        "id": this.orderId,
        "denyCode": this.denyCode,
        "denyReason": this.denyReason
      };
      var successHandler = this.close;

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
      //console.log("i m in.");
      
    })
  }
}

</script>