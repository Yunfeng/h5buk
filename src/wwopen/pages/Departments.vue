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

          <a href="javascript:void(0)" v-on:click="newDept();" class="btn btn-success ml-auto">新建</a> 
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
                <th></th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.name}}</td>
                <td>{{info.deptId}}</td>
                <td>{{info.parentId}}</td>
                <td><a href="javascript:void(0)" v-on:click="syncDeptUsers(info.deptId)">获取成员</a></td>
                <td><a href="javascript:void(0)" v-on:click="editDept(index)">修改</a></td>
                <td><a href="javascript:void(0)" v-on:click="deleteDept(info.id)">删除</a></td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <!-- New Request Modal -->
    <div class="modal" id="modalPolicyManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">
                      <template v-if="id === 0">
                        增加  
                      </template>
                      <template v-else>
                        修改
                      </template>                      
                    </h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                    
                </div>
                <div class="modal-body">
                  <form id="frmUser" role="form" class="form-horizontal">
                    <div class="form-group row">
                        <label class="control-label col-3 text-right">
                            部门ID*    
                        </label>
                        <div class="col-9">
                          <input type="text" class="form-control" v-model="wwDeptId" />
                          <span class="text-muted small">企业微信的部门ID</span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-3 text-right">
                            部门名称*    
                        </label>
                        <div class="col-9">
                          <input type="text" id="frmUser_fullname" class="form-control" name="info.name" v-model="name" />
                          <small class="form-text text-muted"></small>
                        </div>
                    </div>
                

                  </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" v-on:click="saveDept()">保存</button>
                </div>
            </div>
        </div>
    </div>         
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
      newDept: function () {
        this.id = 0
        this.name = ''
        this.parentId = 1
        this.wwDeptId = 0

        $('#modalPolicyManage').modal()
      },
      saveDept: function () {
        if (this.parentId < 1) {
          this.parentId = 1
        }
        const params = {
          'id': this.id,
          'wwDeptId': this.wwDeptId,
          'name': this.name,
          'parentId': this.parentId
        }

        // const jsonParam = JSON.stringify(params)

        createDepartment(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
            // window.alert(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      deleteDept: function (id) {
        const params = {
          'id': id
        }

        deleteDepartment(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg('操作失败: ' + jsonResult.errmsg, 'danger')
          } else {
            this.showErrMsg('操作成功')
            this.search()
          }
        })
      },
      editDept: function (index) {
        const info = this.dataList[index]

        this.id = info.id
        this.wwDeptId = info.deptId
        this.name = info.name
        this.parentId = info.parentId

        $('#modalPolicyManage').modal()
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