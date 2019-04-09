<template>
  <div id="customers">
    <div class="card">
      <div class="card-header bg-info text-white">
        部门信息
      </div>
      <div class="card-body">
        <form class="form-inline" id="frmSearchUser">
          <input type="hidden" name="sc.pageNo" v-model.number="sc.pageNo">
          <input type="hidden" name="sc.pageSize" v-model.number="sc.pageSize">
          <div class="form-group">
              <input type="textfield" class="form-control" placeholder="部门名称" name="sc.name" v-model.trim="searchName" size="15">
          </div>
          <div class="form-group">
              <button type="button" class="btn btn-primary ml-1" @click="search()">查找</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type="button" class="btn btn-secondary btn-sm" title="清空查找条件" @click="reset();">重置</button>
          </div>

        </form>
      </div>
    </div>
    <table class="table table-striped table-sm small">
        <thead>
            <tr>
                <th>部门</th>
                <th>ID</th>
                <th>上级部门ID</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.name}}</td>
                <td>{{info.deptId}}</td>
                <td>{{info.parentId}}</td>
                <td><a href="javascript:void(0)" v-on:click="syncDeptUsers(info.deptId)">获取成员</a></td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

  </div>
</template>

<script>
  import { searchDepartments, syncDeptUsers } from '../../api/admin.js'
  import $ from 'jquery'
  import MyPagination from '../../components/my-pagination.vue'

  export default {
    components: {
      MyPagination
    },
    data () {
      return {
        id: 0,
        name: '',
        parentId: 0,
        wwDeptId: 0,

        dataList: [],

        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 15,
          pageTotal: 0
        },
        searchName: ''
      }
    },
    mounted: function () {
      this.search()
    },
    methods: {
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
        const params = {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.searchName
        }
        // this.showLoading('查询中...')
        searchDepartments(params, (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
          // this.hideLoading()
        })
      },
      syncDeptUsers: function (id) {
        this.showLoading()
        syncDeptUsers(id,
          v =>  {
            if (v.status !== 'OK') {
              this.showErrMsg('操作失败: ' + v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.search()
            }
          },
          () => { this.hideLoading() }
        )
      },
      reset: function () {
        this.name = ''
        this.sc.pageNo = 1
        this.search()
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
    }
  }
</script>