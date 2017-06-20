<template>  
	<div id="article-detail" class="row">
    <div class="col-12 bg-primary text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
      线路介绍
    </div>

    <template v-if="detail">
      <div class="card col-12 offset-sm-2 col-sm-8 offset-md-3 col-md-6 p-0">   
        <div class="card-block">
          <h4 class="card-title">{{detail.name}}</h4>    
          出发地：{{detail.dcity}}<br />
          目的地：{{detail.acity}}<br />
          购买链接：<a :href="detail.buyUrl" target="_blank">{{detail.buyUrl}}</a><br />
          联系购买：{{detail.buyContact}}<br />
        </div>       
        <span class="bg-faded text-center text-muted">介绍 </span>
        <div class="card-block p-1" id="vegDetail" v-html="detail.content"></div>
        <span class="bg-faded text-center text-muted">每日行程</span>
        <table class="table">
          <thead>
            <tr><th></th><th></th><th></th></tr>
          </thead>
          <tbody>
            <template v-for="dayInfo in detail.dayInfos">
              <tr>
                <td>{{dayInfo.day}}</td>
                <td><span v-html="dayInfo.content"></span></td>
                <td>
                  <button class="btn btn-sm btn-danger" @click.stop="delDayInfo(dayInfo.id)">删除</button></td>
              </tr>
            </template>
            <tr>
              <td colspan="3" class="text-right">
                <button class="btn btn-sm btn-success" @click.stop="addDayInfo(detail.id)">增加日程安排</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">创建时间: {{formatDateTime(detail.createTime)}}</li>
          <li class="list-group-item">修改时间: {{formatDateTime(detail.lastupdate)}}</li>
        </ul>
        <div class="card-footer">
          <button class="btn btn-block btn-primary" @click.stop="edit(detail.id)">修改</button>
        </div>
      </div>
    </template>     
  </div>
</template>

<script>
import { getTripDetail, delTripDayInfo } from '../../api/trip.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  data () {
    return {
      id: 0,
      detail: null
    }
  },
  mounted: function () {
    this.id = parseInt(this.$route.params.id)
    this.refreshTripDetail(this.id)
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
    refreshTripDetail: function (id) {
      this.showLoading()

      getTripDetail(id,
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
      var path = '/trip/edit/' + id
      this.$router.push(path)
    },
    formatDateTime: function (val) {
      if (val === null) {
        return ''
      } else {
        return convertLongToTimeDesc(val)
      }
    },
    addDayInfo: function (id) {
      var path = '/trip/' + id + '/day'
      this.$router.push(path)
    },
    delDayInfo: function (id) {
      if (window.confirm('确定删除此日行程安排 吗？') === false) {
        return
      }

      this.showLoading()

      delTripDayInfo(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('操作成功')
            this.refreshTripDetail(this.id)
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
