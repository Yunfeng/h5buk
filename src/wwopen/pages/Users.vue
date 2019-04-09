<template>
  <div id="users">
    <div class="card">
      <div class="card-body">
        <form class="form-inline">
          <div class="form-group">
            <input type="textfield" class="form-control" placeholder="用户名" v-model.trim="username">
          </div>
          <div class="form-group">
            <input type="textfield" class="form-control" placeholder="手机" v-model.trim="mobile">
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-primary" @click.stop="search()">查找</button>
            <button type="button" class="btn btn-secondary btn-sm" @click.stop="reset()">重置</button>
          </div>
        </form>
      </div>
      <table class="table table-striped table-hover table-sm small">
          <thead>
              <tr>
                  <th>用户名</th>
                  <th>全名</th>
                  <th>手机</th>
                  <th>邮件</th>
                  <th>部门</th>
                  <th>企业微信id</th>
                  <th></th>
              </tr>                        
          </thead>
          <tbody>
              <tr v-for="(user, index) in userList" :key="user.username">
                  <td>{{user.username}}</td>
                  <td>{{user.empname}}</td>
                  <td>{{user.mobileNo}}</td>
                  <td>{{user.email}}</td>
                  <td>
                    <template v-for="info in user.departments">
                      {{info.name}},
                    </template>
                  </td>
                  <td>
                    {{user.wwUserId}}
                  </td>
                  <td><a href="javascript:void(0)" @click.stop="editUser(index)">修改</a></td>
              </tr>

          </tbody>
      </table>
    </div>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>

    <!-- New Request Modal -->
    <div class="modal" id="modalPolicyManage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">新增用户</h4>
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                </div>
                <div class="modal-body">
                    <form id="frmUser" role="form" class="form-horizontal">
                        <input type="hidden" id="frmUser_id" name="user.id" v-model="user.id" />
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                用户名*    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_username" class="form-control" name="user.username" placeholder="用户名" v-model="user.username" />
                                <span class="help-block">登录系统用的用户名</span>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                真实姓名*    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_fullname" class="form-control" name="user.empname" placeholder="真实姓名" v-model="user.empname" />
                                <span class="help-block"></span>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                手机    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_mobile" class="form-control" name="user.mobileNo" v-model="user.mobileNo" placeholder="手机号" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                电子邮件    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_email" class="form-control" name="user.email" v-model="user.email" placeholder="电子邮件" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                eterm用户名    
                            </label>
                            <div class="col-md-6">
                                <input type="text" id="frmUser_email" class="form-control" name="user.etermUsername" v-model="user.etermUsername" placeholder="eterm用户名" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="control-label col-md-4">
                                部门    
                            </label>
                            <div class="col-md-6">
                              <select class="form-control" v-model="deptIds"  size="3" multiple>
                                <template v-for="info in departments">
                                    <option :value="info.id" v-if="info.parentId > 0" :key="info.id">{{info.name}}</option>  
                                  </template>
                              </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.stop="createUser()">保存</button>
                </div>
            </div>
        </div>
    </div>
         
    <my-modal-prompt ref="modalPrompt">
      <span slot="title">{{modalTitle}}</span>
    </my-modal-prompt>


  </div>	
</template>

<script>
  import $ from 'jquery'
  import { searchUsers, searchDepartments } from '../../api/admin.js'
  import MyPagination from '../../components/my-pagination.vue'
  import MyModalPrompt from '../../components/my-modal-prompt.vue'

  export default {
    components: {
      MyPagination,
      MyModalPrompt
    },
    data () {
      return {
        modalTitle: '',
        sc: {
          rowCount: 0,
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0
        },
        username: '',
        mobile: '',

        userList: [],
        user: {
          'id': 0,
          'username': '',
          'empname': '',
          'mobileNo': '',
          'email': '',
          'etermUsername': ''
        },
        deptIds: [],
        departments: []
      }
    },
    mounted: function () {
      this.search()
      this.searchDepartments()
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
          'sc.username': this.username,
          'sc.mobile': this.mobile
        }
        searchUsers(params, (jsonResult) => {
          this.userList = jsonResult.dataList
          this.sc = jsonResult.page
        })
      },
      newUser: function () {
        this.user.id = 0
        this.user.username = ''
        this.user.empname = ''
        this.user.mobileNo = ''
        this.user.email = ''
        this.user.etermUsername = ''

        this.deptIds.splice(0)

        $('#modalPolicyManage').modal()
      },
      createUser: function () {
        const params = {
          'id': this.user.id,
          'username': this.user.username,
          'fullName': this.user.empname,
          'mobileNo': this.user.mobileNo,
          'email': this.user.email,
          'etermUsername': this.user.etermUsername,
          'departments': this.deptIds
        }

        createUser(params, (jsonResult) => {
          if (jsonResult.status !== 'OK') {
            this.showErrMsg(jsonResult.errmsg)
          } else {
            $('#modalPolicyManage').modal('hide')
            this.search()
          }
        })
      },
      editUser: function (index) {
        const info = this.userList[index]
        this.user.id = info.id
        this.user.username = info.username
        this.user.empname = info.empname
        this.user.mobileNo = info.mobileNo
        this.user.email = info.email
        this.user.etermUsername = info.etermUsername

        this.deptIds.splice(0)
        for (const d of info.departments) {
          this.deptIds.push(d.id)
        }

        $('#modalPolicyManage').modal()
      },
      searchDepartments: function () {
        const params = {
          'sc.pageNo': 1,
          'sc.pageSize': 500
        }

        searchDepartments(params, (jsonResult) => {
          this.departments = jsonResult.dataList
        })
      },
      delWwUser: function (index) {
        const info = this.userList[index]

        this.modalTitle = '确定从企业微信中删除该用户吗？'

        this.$refs.modalPrompt.modal().then((remark) => {
          this.showLoading()
          const params = {
            'id': info.id,
            'remark': remark
          }
          deleteWwUser(params, v => {
            if (v.status !== 'OK') {
              this.showErrMsg(v.errmsg, 'danger')
            } else {
              this.showErrMsg('操作成功')
              this.search()
            }},
            () => { this.hideLoading() }
          )
        }).catch((ex) => {})
      },
      reset: function () {
        this.username = ''
        this.mobile = ''
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