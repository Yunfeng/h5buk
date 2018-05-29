<template>
  <div id="pickCustomer" class="weui-mask mb-5" v-show="show" style="overflow: auto;">
    <div class="weui-search-bar weui-search-bar_focusing">
        <a href="javascript:" class="weui-search-bar__cancel-btn text-danger ml-1" id="search_cancel" @click="cancel()">取消</a>
        <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" v-model="searchWord" />
                <a href="javascript:" class="weui-icon-clear" @click.stop="reset()"></a>
            </div>
        </form>
        <a href="javascript:void(0)" class="weui-search-bar__cancel-btn" @click="searchPsg()">查找</a>
    </div>

    <ul class="nav nav-tabs bg-faded" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" data-toggle="tab" href="#user" role="tab">已注册用户({{psgs.length}})</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#weixin" role="tab">微信用户({{subscribers.length}})</a>
      </li>
    </ul>

    <!-- Tab panes -->
    <div class="tab-content">
      <div class="tab-pane active" id="user" role="tabpanel">
        <div class="card col-12 px-0">
          <template v-if="psgs.length > 0">
            <div class="card-block py-0 border-bottom-1" v-for="(psg,index) in psgs">
              姓名: {{psg.empname}}
              <span class="float-right mb-2">
                <button type="button" class="btn btn-success btn-sm " @click.stop="selectThisPsg(index);">√</button>
              </span>
            </div>
          </template>
          <template v-else-if="searchCount > 0">
            <div class="card-block pb-0 border-bottom-1 text-center">
              <span class="text-danger">未找到符合的注册客户</span>
            </div>
          </template>
        </div>
      </div>
      <div class="tab-pane" id="weixin" role="tabpanel">
        <div class="card col-12 px-0">
          <template v-if="subscribers.length > 0">
            <div class="card-block py-0 border-bottom-1" v-for="(psg,index) in subscribers">
              昵称: {{psg.nickname}}
              <span class="float-right mb-2">
                <button type="button" class="btn btn-success btn-sm " @click.stop="selectThisSubscriber(index);">√</button>
              </span>
            </div>
          </template>
          <template v-else-if="searchCount > 0">
            <div class="card-block pb-0 border-bottom-1 text-center">
              <span class="text-danger">未找到符合的微信公众号订阅用户</span>
            </div>
          </template>
        </div>
      </div>
    </div>        
  </div>

</template>

<script>
import { searchCustomers } from '../api/user.js'
import { searchSubscribers } from '../api/admin.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchWord: '',
      searchCount: 0,

      psgs: [],
      subscribers: [],

      customerType: 0,
      name: ''
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal) {
        this.reset()
      }
      // console.log('new: %s, old: %s', newVal, oldVal)
    }
  },
  updated: function () {
    // console.log('updated.....')
  },
  methods: {
    cancel: function () {
      this.$emit('close', 0)
    },
    reset: function () {
      this.searchWord = ''
      this.searchCount = 0
      this.psgs.splice(0)
      this.subscribers.splice(0)
    },
    searchPsg: function () {
      this.searchCount++

      var searchWord = this.searchWord.toUpperCase()

      var params = { 'sc.name': searchWord }

      searchCustomers(params,
        (jsonResult) => {
          this.psgs = jsonResult.dataList
        },
        null,
        null
      )

      params = { 'sc.pageNo': 1,
        'sc.pageSize': 50,
        'sc.name': searchWord
      }

      searchSubscribers(params,
        (jsonResult) => {
          this.subscribers = jsonResult.dataList
        }
      )
    },
    selectThisPsg: function (index) {
      this.name = this.psgs[index].empname

      const username = this.psgs[index].username

      this.$emit('close', 1, { 'type': 0, 'name': this.name, 'username': username })
    },
    selectThisSubscriber: function (index) {
      this.name = this.subscribers[index].nickname

      const openid = this.subscribers[index].weixinOpenId

      this.$emit('close', 1, { 'type': 1, 'name': this.name, 'openid': openid })
    }
  }
}
</script>
