<template>
	<div id="art-list" class="row">
    <div class="col-12 bg-primary text-center text-white">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </span>
        团队机票
    </div>

    <div class="card col-12 hidden-md-down">
        <form class="form-inline">
          <input class="form-control m-2 col-1" type="text" placeholder="出发城市" v-model.trim="dport">
          <input class="form-control m-2 col-1" type="text" placeholder="到达城市" v-model.trim="aport">
          <button type="button" class="btn btn-success mr-2" @click.stop="search()">确定</button>
          <button type="button" class="btn btn-info btn-sm" @click.stop="resetFilter()">重置</button>          
        </form>        
      </div>

    <div class="card col-12">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>出发</th>
            <th>到达</th>
            <th>最早</th>
            <th>最晚</th>
            <th>价格</th>
            <th>修改时间</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, index) in dataList">
            <tr @click="showDetail(info)">
              <td>
                {{info.id}}
              </td>
              <td>{{showShortName(info.name)}}</td>
              <td>
                {{info.dcity}}
              </td>
              <td>
                {{info.acity}}
              </td>
              <td>
                {{info.minDate}}
              </td>
              <td>
                {{info.maxDate}}
              </td>
              <td>
                <span v-if="info.price > 0">
                  {{info.price}}
                </span>
              </td>
              <td>
                <template v-if="info.lastupdate">
                  {{formatDateTime(info.lastupdate)}}
                </template>
                <template v-else>
                  {{formatDateTime(info.createTime)}}
                </template>
              </td>
              <td>
                  <i class="fa fa-angle-right text-warning float-right" aria-hidden="true"></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class='card-block'>
          <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination> 
      </div> 
    </div>

  </div>
</template>

<script>
import MyPagination from '../../components/my-pagination.vue'
import { searchGroups } from '../../api/group-flight.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  name: 'GroupList',
  components: {
    'my-pagination': MyPagination
  },
  data () {
    return {
      dataList: [],
      sc: {
        rowCount: 0,
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0
      },
      dport: '',
      aport: ''
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
        'sc.pageSize': this.sc.pageSize,
        'sc.dport': this.dport.toUpperCase(),
        'sc.aport': this.aport.toUpperCase()
      }

      searchGroups(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        null,
        () => { this.hideLoading() }
      )
    },
    showDetail: function (info) {
      var path = '/group/' + info.id
      this.$router.push(path)
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
    showShortName: function (val) {
      if (val.length > 20) {
        return val.substring(0, 20) + '...'
      } else {
        return val
      }
    },
    resetFilter: function () {
      this.dport = ''
      this.aport = ''
      this.sc.pageNo = 1
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
