<template>
	<div id="qinfo-list" class="container-fluid">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>
    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>

    <div class="row" v-show="detailShowing === false && filterShowing == false">  
        <div class="col-12 bg-info text-center">
            <span @click="back()" class="float-left ml-1">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </span>
            Q 列表
            <span @click="showFilter()" class="float-right mr-1">
              <i class="fa fa-filter" aria-hidden="true"></i>
            </span>   
        </div>         

      <div class="card col-12">
        <table class="table table-striped table-condensive">
          <thead>
              <tr>
                  <th class="hidden-xs-down">序号0</th>
                  <th>类型</th>
                  <th>用户名</th>
                  <th>记录编号</th>
                  <th class="hidden-xs-down">联系电话</th>
                  <th class="hidden-xs-down"></th>
                  <th class="hidden-xs-down"></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(flight, index) in qinfoes">
                      <td class="hidden-xs-down">{{flight.id}}</td>
                      <td>
                          {{flight.qtype}}
                      </td>
                      <td>{{flight.username}}</td>
                      <td>
                          <a href="javascript:void(0);" :title="flight.qdetail" data-toggle="tooltip" @click="showPnrDetail(flight.qdetail)">{{flight.pnrno}}</a>
                      </td>
                      <td class="hidden-xs-down">
                          {{flight.linkphone}}
                      </td>
                      <td class="hidden-xs-down">
                          <span v-if="flight.beManaged === '2'">
                              <button class="btn btn-info btn-xs" @click="reInform(index)">再次通知</button>
                          </span>
                      </td>
                      <td class="hidden-xs-down">
                          {{flight.createDate.substring(0, 10)}} {{flight.createTime}}
                      </td>
              </tr>
          </tbody>
        </table>
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>

      </div> 

    </div>


    <div class="row" v-show="detailShowing">
      <div class="col-12 bg-info">
          <span @click="hideDetail()"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
          编码详情
      </div> 
      <div class="card col-12" v-if="pnrDetail != null ">
        <div v-html="'<pre>' + pnrDetail + '</pre>'"></div>        
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
              <input class="form-control" type="text" placeholder="请输入编码" v-model="pnrNo">
          </div>
          <div class="form-group">
              <input class="form-control" type="text" placeholder="请输入用户名" v-model="username">
          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'

export default {
  components:{
    MyPagination
  },
  data () {
    return {
      errAlert: false,
      errMsg: false,
      loading: false,
      loadingText: "数据加载中",
      detailShowing: false,
      filterShowing: false,
      pnrDetail: "",

      qinfoes: [],
      sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 25,
          pageTotal: 0,
      },
      pnrNo: "",
      username: ""
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  beforeCreate: function () {
    this.$options.components.MyPagination = require('../components/my-pagination.vue')
  },
  mounted: function() {
    //console.log(this.qinfoes.length);
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
          url : "/Flight/qinfoes/",
          data : {
            "sc.pageNo": self.sc.pageNo, 
            "sc.pageSize": self.sc.pageSize,
            "sc.pnrNo": self.pnrNo,
            "sc.username": self.username
          },
          dataType: "json",
          success : function(jsonResult) {
            //console.log(jsonResult);
              self.qinfoes = jsonResult.dataList;
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
    showPnrDetail: function(qdetail) {
      this.detailShowing = true;
      this.pnrDetail = qdetail;
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
      this.pnrNo = "";
      this.username = "";
    },
    reInform: function(index) {
      var id = this.qinfoes[index].id;
      var self = this;

      $.ajax({
        type : "post",
        url : "/Flight/qinfoes/reInformQinfo.do",
        data: {id: id},
        dataType: "json",
        success : function(jsonResult) {
          if (jsonResult.status === "OK") {
              self.search();
          } else {
              self.showErrMsg("操作失败");
          }
        }
      });
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