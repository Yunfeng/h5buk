<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      客户信息
    </div> 

    <div class="card col-12 mt-4 px-0">
      <table class="table table-sm table-striped table-condensive">
        <thead>
            <tr>
                <th>用户名</th>
                <th>名称</th>
                <th>email</th>
                <th>积分</th>
                <th>现金账户(元）</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.username}}</td>
                <td>{{info.empname}}</td>
                <td>{{info.email}}</td>
                <td><span @click="showIncPoints(info.id)">{{info.balance}}</span></td>
                <td>{{info.cashBalanceYuan}} 
                </td>
            </tr>
        </tbody>
      </table>
      <div class="card-block">
        <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
      </div>
    </div>


    

    <div class="modal fade" id="incPoints">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">增加积分</h4>
              <button type="button" class="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    
            </div>
              <div class="modal-body">
                <form role="form" class="form-horizontal">
                    <div class="form-group">
                        <label class="control-label">
                            积分数量    
                        </label>
                        <div>
                            <input type="text" class="form-control" v-model="points" />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">
                            备注(调整事由)    
                        </label>
                        <div >
                            <input type="text" class="form-control" v-model="remark" />
                        </div>
                    </div>
                </form>
              </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary btn-lg" @click.stop="doIncPoints();">确定</button>
                </div>
            </div>
        </div>
    </div>    
  </div>
</template>

<script>
import MyPagination from '../../components/my-pagination.vue'
import $ from 'jquery'
import { incPoints } from '../../api/user.js'

export default {
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      points: 0,
      remark: '',
      customerId: 0,

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      }
    }
  },
  mounted: function () {
    this.search()
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
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'post',
        url: '/Flight/user/customers',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
        },
        dataType: 'json',
        success: function (jsonResult) {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          self.searching = false

          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
        }
      })
    },
    showIncPoints: function (id) {
      this.customerId = id
      this.points = 0
      this.remark = ''

      var modal = $('#incPoints')
      modal.modal('show')
    },
    doIncPoints: function () {
      this.showLoading()

      var params = { 'customerId': this.customerId,
        'points': this.points,
        'remark': this.remark
      }

      incPoints(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('ok', 'success')
            $('#incPoints').modal('hide')
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        null,
        () => { this.hideLoading() }
      )
    },
    prevPage: function () {
      this.sc.pageNo = this.sc.pageNo - 1
      if (this.sc.pageNo < 1) this.sc.pageNo = 1
      this.search()
    },
    nextPage: function () {
      this.sc.pageNo = this.sc.pageNo + 1
      this.search()
    },
    directPage: function (pageNo) {
      this.sc.pageNo = pageNo
      this.search()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
