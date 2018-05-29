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
                <th></th>
                <th>生成时间</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for='(info, index) in dataList' @click="showDetail(info)">
                <td>{{info.key}}

                </td>
                <td><img class="d-flex mr-3" :src="'http://video.90sky.com/' + info.key" style="width: 2rem; height: 2rem"></td>
                <td>
                  <small>{{formatTime(info.createTime)}}</small>
                  <span class="float-right"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                </td>
            </tr>
        </tbody>
      </table>
      <div class='card-block'>
        <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </div> 
    </div>      
  </div>
</template>

<script>
import MyPagination from '../components/my-pagination.vue'
import { convertLongToTimeDesc } from '../common/common.js'
import { searchMaterials } from '../api/material.js'

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
