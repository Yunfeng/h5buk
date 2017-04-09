<template>  
	<div id="pnr-mobile" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
        <span @click='back()' class="float-left">
          <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
          <small>返回</small>
        </span>
        手机号列表        
      </div> 

      <div class="card col-12 px-0">
        <table class="table table-striped">
          <thead>
              <tr>
                  <th>手机</th>
                  <th></th>
                  <th>生成时间</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(info, index) in dataList">
                <td>{{info.mobile}}</td>
                <td>{{info.count}}</td>
                <td>{{formatTime(info.createTime)}}</td>
                </td>

                <td>
                  <span class="" @click.stop="deletePnrMobile(info)"><i class="fa fa-times" aria-hidden="true"></i></span>
                </td>
            </tr>

          </tbody>
        </table>
      
        <div class="card-block">
          <my-pagination :row-count="sc.rowCount" :page-total="sc.pageTotal" :page-no="sc.pageNo" @next-page="nextPage" @prev-page="prevPage" @direct-page="directPage"></my-pagination>
        </div>
      </div>

     



      <div class="card col-12 card-outline-secondory px-0">
        <div class="card-block">
          <input type="text" class="form-control" v-model="mobile" placeholder="手机号">
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-success" @click.stop="savePnrMobile()">保存</button>
        </div>
      </div>      
    
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import MyButton from '../components/my-button.vue'
import MyInput from '../components/my-input.vue'

import $ from 'jquery'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
  name: 'PnrMobile',
  components: {
    'my-pagination': MyPagination,
    'my-button': MyButton,
    'my-input': MyInput
  },
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 25,
        pageTotal: 0
      },
      mobile: ''
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
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      $.ajax({
        type: 'get',
        url: '/Flight/pnr/mobile',
        data: {
          'sc.pageNo': this.sc.pageNo,
          'sc.pageSize': this.sc.pageSize
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
      this.mobile = ''
    },
    savePnrMobile: function () {
      var self = this
      $.ajax({
        type: 'post',
        url: '/Flight/pnr/mobile',
        data: {
          'mobile': self.mobile
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            if (jsonResult.status === 'OK') {
              self.reset()
              self.search()
            } else {
              self.showErrMsg('错误：' + jsonResult.errmsg)
            }
          }
        }
      })
    },
    deletePnrMobile: function (info) {
      var self = this
      $.ajax({
        type: 'post',
        url: '/Flight/pnr/mobile/delete',
        data: {
          'id': info.id
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            if (jsonResult.status === 'OK') {
              self.search()
            } else {
              self.showErrMsg(jsonResult.errmsg)
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
