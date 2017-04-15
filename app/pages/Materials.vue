<template>
	<div id="material-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click='back()' class="float-left">
        <i class='fa fa-angle-left fa-2' aria-hidden='true'></i>
        <small>返回</small>
      </span>
      媒体文件
    </div> 
      
    <div class="card col-12 px-0">   
      <table class='table table-sm table-striped'>
        <thead>
            <tr>
                <th>文件</th>
                <th>生成时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for='(info, index) in dataList' @click="showDetail(info)">
                <td>{{info.key}}</td>
                <td><small>{{formatTime(info.createTime)}}</small></td>
                <td><i class="fa fa-angle-right" aria-hidden="true"></i></td>
            </tr>
        </tbody>
      </table>
      <div class='card-block'>
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </div> 
      <div class="card">
        <div class="card-block">
          <button class="btn btn-success" @click.stop="syncMaterial()">同步一下</button>
        </div>
      </div>
    </div>      
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import { convertLongToTimeDesc } from '../common/common.js'
import { searchMaterials, syncMaterials } from '../api/material.js'

export default {
  name: 'materials',
  components: {
    'my-pagination': MyPagination
  },
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
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    this.search()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    search: function () {
      this.showLoading()
      var self = this

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchMaterials(params,
        (jsonResult) => {
          self.dataList = jsonResult.dataList
          self.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
    },
    syncMaterial: function () {
      this.showLoading()

      syncMaterials(null,
        () => { },
        null,
        () => { this.search() }
      )
    },
    showDetail: function (info) {
      this.$router.push('/play/' + info.id)
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
    formatTime: function (l) {
      return convertLongToTimeDesc(l)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.search()
    })
  }
}
</script>
