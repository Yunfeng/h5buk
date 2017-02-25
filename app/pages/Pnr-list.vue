<template>
	<div id="pnr-list" class="container">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row bg-info">
      <div class="col-1">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10 text-center">
          PNR列表
      </div>         
      <div class="col-1">
          
      </div>         
    </div> 
      
    <div class="row">
      <div class="card col-12">   
        <table class="table table-striped table-condensed">
          <thead>
              <tr>
                  <th>编码</th>
                  <th></th>
                  <th>用户名</th>
                  <th></th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList" @click="showDetail(info)">
                  <td>{{info.pnrNo}}</td>
                  <td><small>{{info.segStatus}}</small></td>
                  <td>{{info.etermUsername}}</td>
                  <td><small>{{convertLongToTimeDesc(info.createTime)}}</small></td>
                  <td><small>{{convertLongToTimeDesc(info.lastUpdate)}}</small></td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination name="pagination" :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination> 
        </div> 
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
import MyPagination from '../components/my-pagination.vue'

export default {
  name: 'pnr-list',
  components:{
    'my-pagination': MyPagination
  },
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: "数据加载中",

      dataList: [],
      sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
      }
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function() {
    this.search();
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    search: function() {
      var self = this;
      self.loading = true;
      self.loadingText = "数据加载中";

      $.ajax({
          type : "post",
          url : "/Flight/pnr/list.do",
          data : {
            "sc.pageNo": this.sc.pageNo, 
            "sc.pageSize": this.sc.pageSize
          },
          dataType: "json",
          success : function(jsonResult) {
              self.dataList = jsonResult.dataList;
              self.sc = jsonResult.page;
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
    showDetail: function(info) {
      this.$store.commit("setPnrDetail", info);
      this.$router.push("/pnr/detail");
      
    },
    prevPage: function() {
        this.sc.pageNo = this.sc.pageNo - 1;
        if (this.sc.pageNo < 1) this.sc.pageNo = 1;
        this.search();
    },
    nextPage: function() {
        this.sc.pageNo = this.sc.pageNo + 1;
        this.search();
    },
    directPage: function(pageNo) {
        this.sc.pageNo = pageNo;
        this.search(); 
    },
    convertLongToTimeDesc: function(l) {
      if (l === null) return;
      return this.getFormatDate(new Date(l)).substring(5, 16);  
    },
    getFormatDate: function(date, pattern) {  
        if (date == undefined) {  
            date = new Date();  
        }  
        if (pattern == undefined) {  
            pattern = "yyyy-MM-dd hh:mm:ss";  
        }  
        return date.format(pattern);  
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