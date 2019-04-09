<template>  
	<div id="qinfo-setting" class="row">
    <template  v-if="detailShowing === false">
      <div class="col-12 bg-info text-center text-white fa-2 sticy-top">
          <span @click="back()" class="float-left">
            <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
            <small>返回</small>
          </span>
        Q通知设置  
      </div>               
      <div class="card col-12 px-0">
        <div class="card-block">
          <div class="form-group row">
              <input type="textfield" class="form-control col-4" placeholder="条件值"  v-model="name">
              <div class="col-4">
                <button type="button" class="btn btn-primary" @click="search()">查找</button>
              </div>
              <div class="col-4 float-right">
                <button class="btn btn-success" @click="newNotice()">新建</button> 
              </div>
          </div>
        </div>
        <table class="table table-striped table-sm">
          <thead>
              <tr>
                  <th class="hidden-md-down">条件类型</th>
                  <th>条件值</th>
                  <th>email</th>
                  <th class="hidden-md-down">手机</th>
                  <th class="hidden-md-down">微信id</th>
                  <th class="hidden-md-down">生成时间</th>
                  <th class="hidden-md-down">修改时间</th>
                  <th class="hidden-xs"></th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(info, index) in dataList">
                <td class="hidden-md-down">{{getConditionTypeDesc(info.conditionType)}}</td>
                <td>{{info.conditionValue}}</td>
                <td>{{info.email}}</td>
                <td class="hidden-md-down">{{info.mobile}}</td>
                <td class="hidden-md-down">{{info.weixinId}}</td>
                <td  class="hidden-md-down">{{formatTime(info.createTime)}}</td>
                <td  class="hidden-md-down">
                    <template v-if="info.lastupdate != null">
                        {{formatTime(info.lastupdate)}}
                    </template>
                </td>

                <td class="hidden-md-down">
                    <a href="javascript:void(0)" class="btn btn-info btn-sm" @click.stop="editNotice(info)">修改</a>
                </td>
            </tr>

          </tbody>
        </table>
      
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>


      </div>
    </template>
    <template v-if="detailShowing">
      <div class="col-1 bg-info">
          <span @click="hideDetail()"><i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i></span>
      </div>         
      <div class="col-10  bg-info text-center">
          新建
      </div>         
      <div class="col-1 bg-info">
          
      </div>         

      <div class="card col-12 card-outline-primary">
        <div class="card-block">
          <div class="form-group row">
            <label class="col-4" >条件类型</label>
            <div class="col-8">
                <select class="form-control"  v-model="conditionType">
                    <option value="0">Office</option>
                    <option value="1">手机</option>
                    <option value="2">eterm用户名</option>
                </select>
            </div>
          </div>
          <my-input label-text="条件值" placeholder="" v-model="conditionValue"></my-input>
          <my-input label-text="电子邮件" placeholder="" v-model="email"></my-input>
          <my-input label-text="手机" placeholder="" v-model="mobile"></my-input>
          <my-input label-text="微信" placeholder="" v-model="weixinId"></my-input>
        </div>
        <div class="card-block">
          <my-button @click="saveNotice()" type="primary">保存</my-button>
          <my-button @click="hideDetail()" type="default">取消</my-button>
        </div>
      </div>      
    </template>
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'
import { convertLongToTimeDesc } from '../common/common.js'

import $ from 'jquery'

export default {
  components: {
    'my-pagination': MyPagination,
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      detailShowing: false,
      pnrDetail: '',

      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      name: '',

      id: 0,
      conditionType: 0,
      conditionValue: '',
      email: '',
      mobile: '',
      weixinId: ''
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
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
        url: '/Flight/qinfoes/settings',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize,
          'sc.name': this.name
        },
        dataType: 'json',
        success: function (jsonResult) {
          // console.log(jsonResult)
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
    showDetail: function () {
      this.detailShowing = true
    },
    hideDetail: function () {
      this.detailShowing = false
    },
    getConditionTypeDesc: function (type) {
      if (type === 0) {
        return 'Office号'
      } else if (type === 1) {
        return '手机号'
      } else if (type === 2) {
        return 'eterm用户名'
      }
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
    },
    reset: function () {
      this.id = 0
      this.conditionType = 0
      this.conditionValue = ''
      this.email = ''
      this.mobile = ''
      this.weixinId = ''
    },
    newNotice: function () {
      this.reset()
      this.showDetail()
    },
    editNotice: function (info) {
      this.reset()
      this.showDetail()

      this.id = info.id
      this.conditionType = info.conditionType
      this.conditionValue = info.conditionValue
      this.email = info.email
      this.mobile = info.mobile
      this.weixinId = info.weixinId
    },
    saveNotice: function () {
      var self = this
      $.ajax({
        type: 'post',
        url: '/Flight/qinfoes/settings/save',
        data: {
          'qinfoNotice.id': self.id,
          'qinfoNotice.conditionType': self.conditionType,
          'qinfoNotice.conditionValue': self.conditionValue,
          'qinfoNotice.email': self.email,
          'qinfoNotice.mobile': self.mobile,
          'qinfoNotice.weixinId': self.weixinId
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            if (jsonResult.status === 'OK') {
              self.hideDetail()
              self.search()
            } else {
              self.showErrMsg('拒绝： ' + jsonResult.errmsg)
            }
          }
        }
      })
    },
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
