<template>  
	<div id="article-detail" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      团队机票
    </div>

    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title">{{detail.name}}</h4>    
          出发地：{{detail.dcity}}<br />
          目的地：{{detail.acity}}<br />
          最早：{{detail.minDate}}<br />
          最晚：{{detail.maxDate}}<br />
          最低价: {{detail.price}}<br />
          <!-- 购买链接：<a :href="detail.buyUrl" target="_blank">{{detail.buyUrl}}</a><br /> -->
          联系方式：{{detail.buyContact}}<br />
        </div>       
        <span class="bg-faded text-center text-muted">详细介绍 </span>
        <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">创建时间: {{formatDateTime(detail.createTime)}}</li>
          <li class="list-group-item">修改时间: {{formatDateTime(detail.lastupdate)}}</li>
        </ul>
        <div class="card-footer" v-if="detail.enterpriseId > 0">
          <button class="btn btn-block btn-primary" @click.stop="edit(detail.id)">修改</button>
          <button class="btn btn-block btn-primary" @click.stop="copy(detail.id)">复制</button>
        </div>
      </div>
    </template>     
  </div>
</template>

<script>
import { getGroupTravel } from '../../api/group-flight.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  data () {
    return {
      detail: null
    }
  },
  mounted: function () {
    var id = this.$route.params.id
    if (id !== undefined) {
      this.refresh(parseInt(id))
    }
  },
  updated: function () {
    // this.addImgFluid()
    // this.bindCarousel()
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
    refresh: function (id) {
      this.showLoading()

      getGroupTravel(id,
        (jsonResult) => {
          if (jsonResult !== null && jsonResult.id === id) {
            this.detail = jsonResult
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    edit: function (id) {
      var path = '/group/edit/' + id
      this.$router.push(path)
    },
    copy: function (id) {
      var path = '/group/new/' + id
      this.$router.push(path)
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
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
