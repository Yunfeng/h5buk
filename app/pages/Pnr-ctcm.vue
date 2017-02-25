<template>
	<div id="pnr-ctcm" class="container">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>

    <div class="row" v-if="filterShowing === false && detailShowing === false">
      <div class="col-2 bg-info">
          <span @click="back()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-8 text-center bg-info">
          缺CTCM列表
      </div>         
      <div class="col-2 bg-info">
          <span @click="showFilter()">
            <i class="fa fa-filter" aria-hidden="true"></i>
          </span>
      </div>         

      <div class="card col-12">
        <ul class="list-inline bg-warning">
          <li class="list-inline-item">快速过滤</li>
          <li class="list-inline-item"><button @click.stop='setCarrier("CA")'>CA</button></li>
          <li class="list-inline-item"><button @click.stop='setCarrier("MU")'>MU</button></li>
        </ul>
        <table class="table table-striped table-condensive">
          <thead>
              <tr>
                  <th>编码</th>
                  <th class="hidden-sm-down">人数/ctcm</th>
                  <th>用户名</th>
                  <th class="hidden-sm-down">生成时间</th>
                  <th>更新时间</th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(info, index) in dataList"  @click="showDetail(info)">
                  <td>{{info.pnrNo}}</td>
                  <td class="hidden-sm-down">{{info.psgCount}}/{{info.ctcmCount}}</td>
                  <td>{{info.etermUsername}}</td>
                  <td class="hidden-sm-down"><small>{{convertLongToTimeDesc(info.createTime)}}</small></td>
                  <td><small>{{convertLongToTimeDesc(info.lastUpdate)}}</small></td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
      </div>
      
    </div>      
    <div class="row" v-show="filterShowing">
      <div class="col-12 text-right mt-3 mr-5">              
        <button type="button" class="btn btn-sm btn-info" @click.stop="resetFilter()">重置</button>
        <button type="button" class="btn btn-sm btn-success" @click.stop="hideFilter()">确定</button>
      </div>

      <div class="card col-12 mt-2 card-outline-primary">
        <div class="card-block">
          <div class="card-title">查询条件</div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="请输入航司两字代码" v-model="carrier">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="用户名" v-model="etermUsername">
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-show="detailShowing">
      <div class="col-2 bg-info">
          <span @click="hideDetail()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-8 text-center bg-info">
          编码详情
      </div>         
      <div class="col-2 bg-info">
      </div>         

      <div class="weui-cell" v-if="pnrDetail != null ">
        <div v-html="'<pre>' + pnrDetail + '</pre>'"></div>        
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
  components:{
    'my-pagination': MyPagination
  },
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: "数据加载中",
      filterShowing: false,
      detailShowing: false,

      sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0
      },
      carrier: "",
      etermUsername: "",

      dataList: [],
      pnrDetail: '',
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
          url : "/Flight/pnr/searchCtcm.do",
          data : {
            "sc.pageNo": this.sc.pageNo, 
            "sc.pageSize": this.sc.pageSize,
            "carrier": this.carrier,
            "etermUsername": this.etermUsername
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
      //this.$store.commit("setPnrDetail", info);
      //this.$router.push("/pnr/detail");      
      this.pnrDetail = info.pnrDetail;
      this.detailShowing = true;
    },
    hideDetail: function() {
      this.detailShowing = false;
    },
    showFilter: function() {
      this.filterShowing = true;
    },
    hideFilter: function() {
      this.filterShowing = false;
      this.search();
    },
    resetFilter: function() {
      this.carrier = '';
      this.etermUsername = '';
    },
    setCarrier: function (val) {
      this.carrier = val;
      this.search();
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