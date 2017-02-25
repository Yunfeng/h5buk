<template>
	<div id="pnr-detail" class="container">
    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          PNR详情
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 

    <div class="row">
      <template v-if="detail">
        <div class="card col-12">
          <table class="table">
            <tbody>
              <tr><td>编码</td><td>{{detail.pnrNo}}</td></tr>
              <tr><td>大编码</td><td>{{detail.bigPnrNo}}</td></tr>
              <tr><td>出发机场</td><td>{{getPortDesc(detail.departurePort)}}</td></tr>
              <tr><td>到达机场</td><td>{{getPortDesc(detail.arrivalPort)}}</td></tr>
              <tr><td>航班号</td><td>{{detail.flightNo}}</td></tr>
              <tr><td>出发日期</td><td>{{detail.departureDate}}</td></tr>
              <tr><td>舱位</td><td>{{detail.subClass}}</td></tr>
              <tr><td>航段状态</td><td>{{detail.segStatus}}</td></tr>
              <tr><td>航段数</td><td>{{detail.segCount}}</td></tr>
              <tr><td>乘客数</td><td>{{detail.psgCount}}</td></tr>
              <tr><td>eterm用户名</td><td>{{detail.etermUsername}}</td></tr>
              <tr><td>更新时间</td><td>{{detail.updateTimeDesc}}</td></tr>
              <tr><td></td><td>{{convertLongToTimeDesc(detail.lastUpdate)}}</td></tr>

            </tbody>
          </table>
          <div class="card-footer" v-if="detail.pnrDetail != null ">
            <div v-html="'<pre>' + detail.pnrDetail + '</pre>'">
            </div>
          </div>    
        </div>    
        
      </template>     
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      errAlert: false,
      loading: false,
      loadingText: "数据加载中"
    }
  },
  computed: {
    detail() {return this.$store.state.pnrDetail}
  },
  mounted: function() {
    //this.search();
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    getIntlPolicyDesc: function(val) {
      var desc = "国内";
      if (val === 1) desc = "国际";

      return desc;
    },
    getRouteTypeDesc: function(val) {
      var desc = "单程";
      if (val === 1) desc = "往返";
      return desc;
    },
    getStatusDesc: function(val) {
      var desc = "启用中";
      if (val === 0) desc = "停用";
      return desc;
    },
    getPortDesc: function(val) {
      var desc = val;
      if (val === "*") desc = "全国";
      return desc;
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
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      //console.log("i m in.");
      
    })
  }
}

</script>