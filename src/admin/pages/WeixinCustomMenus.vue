<template>  
	<div id="tmc-list" class="row">
    <div class="col-12 bg-info text-white text-center fa-2 sticky-top">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      自定义菜单
    </div> 

    <div class="card col-12 mt-4 px-0">
      <table class="table table-sm table-striped table-condensive">
        <thead>
            <tr>
                <th>level</th>
                <th>name</th>
                <th>type</th>
                <th>url</th>
                <th>key</th>
                <th></th>
                <th>创建时间</th>
                <th></th>
            </tr>                        
        </thead>
        <tbody>
          <template v-for="(info, index) in dataList">
            <template v-if="info.level === 1">
              <tr>
                  <td>{{info.level}}</td>
                  <td>{{info.name}}</td>
                  <td>{{info.type}}</td>
                  <td>{{info.url}}</td>
                  <td>{{info.key}}</td>
                  <td>
                    <button class="btn btn-sm btn-info" @click.stop="copyMenu(index)">复制</button>
                    <button class="btn btn-sm btn-info-outline" @click.stop="createSubMenu(index)">增加子菜单</button>
                  </td>
                  <td>{{formatDateTime(info.createTime)}}</td>
                  <td><button class="btn btn-sm btn-danger" @click.stop="deleteMenu(info.id)">删除</button></td>
              </tr>
              <template v-for="(info2, index2) in dataList">
                <tr v-if="info2.level === 2 && info2.parentId === info.id">
                  <td>{{info2.level}}</td>
                  <td>{{info2.name}}</td>
                  <td>{{info2.type}}</td>
                  <td>{{info2.url}}</td>
                  <td>{{info2.key}}</td>
                  <td><button class="btn btn-sm btn-info" @click.stop="copyMenu(index2)">复制</button></td>
                  <td>{{formatDateTime(info2.createTime)}}</td>
                  <td><button class="btn btn-sm btn-secondary" @click.stop="deleteMenu(info2.id)">删除</button></td>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>
  
        <div class="card-block">
          <div class="form-group row">
            <label class="col-2 text-right">名称</label>
            <div class="col-10">
              <input class="form-control" v-model="name">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">层级</label>
            <div class="col-10">
              <input class="form-control" v-model="level">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">上级ID</label>
            <div class="col-10">
              <input class="form-control" v-model="parentId">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">类型</label>
            <div class="col-8">
                <select class="form-control"  v-model="type">
                    <option value="">无</option>
                    <option value="view">视图</option>
                    <option value="click">按钮</option>
                </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">URL</label>
            <div class="col-10">
              <input class="form-control" v-model="url">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-2 text-right">Key</label>
            <div class="col-10">
              <input class="form-control" v-model="key">
            </div>
          </div>
        </div>
        <div class="card-block text-center">
          <button class="btn btn-success btn-block" @click.stop="createMenu()">保存</button>
          <button class="btn btn-danger-outline btn-block" @click.stop="reset()">取消</button>

        </div>
      </div> 
            
  </div>
</template>

<script>
import { searchCustomMenus, deleteCustomMenu, createCustomMenu } from '../../api/admin.js'
import { convertLongToTimeDesc } from '../../common/common.js'

export default {
  data () {
    return {
      dataList: [],
      name: '',
      level: 1,
      parentId: 0,
      type: '',
      url: '',
      key: ''
    }
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

      searchCustomMenus(
        (jsonResult) => {
          this.dataList = jsonResult.dataList
        },
        null,
        () => this.hideLoading()
      )
    },
    deleteMenu: function (id) {
      this.showLoading()

      deleteCustomMenu(id,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('已删除')
            this.search()
          } else {
            this.showErrMsg('删除不成功', 'danger')
          }
        },
        null,
        () => this.hideLoading()
      )
    },
    createMenu: function () {
      this.showLoading()

      var params = { 'name': this.name,
        'type': this.type,
        'level': this.level,
        'parentId': this.parentId,
        'url': this.url,
        'key': this.key
      }

      createCustomMenu(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('已保存')
            this.search()
          } else {
            this.showErrMsg('保存不成功', 'danger')
          }
        },
        null,
        () => this.hideLoading()
      )
    },
    copyMenu: function (index) {
      const o = this.dataList[index]
      this.name = o.name
      this.level = o.level
      this.parentId = o.parentId
      this.type = o.type
      this.url = o.url
      this.key = o.key
    },
    createSubMenu: function (index) {
      const o = this.dataList[index]
      this.reset()
      this.level = 2
      this.parentId = o.id
    },
    reset: function () {
      this.name = ''
      this.level = 1
      this.parentId = 0
      this.type = ''
      this.url = ''
      this.key = ''
    },
    formatDateTime: function (val) {
      return convertLongToTimeDesc(val)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
