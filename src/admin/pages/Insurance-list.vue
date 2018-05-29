<template>
	<div id="art-list" class="row">
    <div class="col-12 bg-primary text-center text-white">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </span>
        保险产品
    </div>

    <div class="col-12 my-2">
      <span class="float-right">
        <router-link to="/p/insurance/new" class="btn btn-success ml-3">
          创建
        </router-link>
      </span>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>代码</th>
          <th>说明</th>
          <th>价格</th>
          <th>折扣</th>
          <th>修改时间</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(info, index) in dataList">
          <tr>
            <td>
              {{info.id}}
            </td>
            <td>{{info.productName}}</td>
            <td>
              {{info.productCode}}
            </td>
            <td>
              {{info.productDesc}}
            </td>
            <td>
              {{info.price}}
            </td>
            <td>
              {{info.discount}}
            </td>
            <td>
              <template v-if="info.lastupdate">
                {{formatDateTime(info.lastupdate)}}
              </template>
              <template v-else>
                {{formatDateTime(info.createTime)}}
              </template>
            </td>
            <td><button @click.stop="deleteInsurance(info.id)" class="btn btn-danger btn-sm">删除</button></td>
          </tr>
        </template>
      </tbody>
    </table>


  </div>
</template>

<script>
import { searchInsurances, deleteInsurance } from '../../api/product.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  data () {
    return {
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
      this.showLoading()

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchInsurances(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
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
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    deleteInsurance: function (id) {
      this.showLoading()

      deleteInsurance(id,
        (jsonResult) => {
          this.search()
        },
        null,
        () => { this.hideLoading() }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // console.log('i m in.')
    })
  }
}
</script>
