<template>  
	<div id="article-detail" class="row">
    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title text-center">{{detail.title}}</h4>          
        </div>       
        <span class="bg-faded text-center text-muted">&nbsp;</span>
        <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
      </div>
    </template>     
  </div>
</template>

<script>
import { refreshArticle } from '../api/article.js'
import { convertLongToTimeDesc } from '../common/common.js'

export default {
  name: 'article-detail',
  data () {
    return {
      detail: null
    }
  },
  mounted: function () {
    this.hideBottomBar()
    var id = this.$route.params.id
    if (id !== undefined) {
      this.refreshArticle(parseInt(id))
    }
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
    hideBottomBar: function () {
      this.$store.commit('hideBottomTabBar')
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    refreshArticle: function (id) {
      this.showLoading()

      refreshArticle(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.detail = jsonResult
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      window.scroll(0, 0)
    })
  }
}
</script>
