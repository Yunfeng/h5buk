<template>
	<div id="art-list" class="row">
    <div class="col-12 bg-primary text-center text-white">
        <span @click="back()" class="float-left">
          <i class="fa fa-angle-left" aria-hidden="true"></i>
        </span>
        文章列表
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>创建时间</th>
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
            <td>
              <span :id="'title.' + index">{{info.title}}</span> 
              <a @click.stop="copy('title.' + index)" class="small float_right">复制</a>
            </td>
            <td>
              {{formatDateTime(info.createTime)}}
            </td>
            <td>
              {{formatDateTime(info.lastupdate)}}
            </td>
            <td>
                <i class="fa fa-angle-right text-warning float-right" aria-hidden="true"></i>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

  </div>
</template>

<script>
import { searchArticles } from '../../api/article.js'
import { convertLongToTimeDesc, copySelectionText } from '../../common/common.js'

export default {
  data () {
    return {
      loading: false,
      loadingText: '数据加载中',

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
    search: function () {
      var self = this
      self.loading = true
      self.loadingText = '数据加载中'

      var params = { 'sc.pageNo': this.sc.pageNo,
        'sc.pageSize': this.sc.pageSize
      }

      searchArticles(params,
        (jsonResult) => {
          this.dataList = jsonResult.dataList
          this.sc = jsonResult.page
        },
        (status, statusText) => {},
        () => { this.loading = false }
      )
    },
    showDetail: function (info) {
      var path = '/art/' + info.id
      this.$store.commit('setArticle', info)
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
    copy: function (val) {
      console.log(val)
      copySelectionText(val)
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
