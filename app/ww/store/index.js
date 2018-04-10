import Vue from 'vue'
import Vuex from 'vuex'

import { authWorkWeixinUser } from '../../api/workweixin.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bottomTabBarShowed: true,
    logined: false,
    username: '',
    fullname: '',
    roles: '',

    historyStep: 0,
    errAlert: false,
    errMsg: '',
    errMsgType: 'warning',
    
    loading: false,
    loadingText: '数据加载中',

    wxInfo: {
      code: '',
      state: '',
      nickname: '',
      headimgurl: '',
      subscribe: 0,
      userid: ''
    }
  },
  mutations: {
    init (state) {
      // 初始化，读取cookie中的数据
      var username = $.cookie('username')
      if (username !== undefined) {
        state.username = username
        state.logined = true
      }

      var userid = $.cookie('userid')
      if (userid !== undefined) {
        state.wxInfo.userid = userid

        var nickname = $.cookie('nickname')
        if (nickname !== undefined) {
          state.wxInfo.nickname = nickname
        }
        
        var headimgurl = $.cookie('headimgurl')
        if (headimgurl !== undefined) {
          state.wxInfo.headimgurl = headimgurl
        }
      }      
    },
    jumpToLogin (state, router) {
      state.historyStep = -1;
      state.username = "",
      state.logined = false;

      $.removeCookie('username', { path: '/' }); 
      $.removeCookie('token', { path: '/' }); 

      router.push("/login");
    },
    logout(state)  {
      state.historyStep = -1;
      state.username = ""
      state.logined = false;

      $.removeCookie('username', { path: '/' }); 
      $.removeCookie('token', { path: '/' }); 
      // $.removeCookie('openid', { path: '/' }); 
      // $.removeCookie('userid', { path: '/' }); 
      $.removeCookie('nickname', { path: '/' }); 
    },
    showLoading(state, payload) {
      state.loading = payload.loading
      if (payload.loadingText === undefined) {
        state.loadingText = '数据加载中...'
      } else {
        state.loadingText = payload.loadingText  
      }
    },
    hideBottomTabBar(state) {
      state.bottomTabBarShowed = false
    },
    showBottomTabBar(state) {
      state.bottomTabBarShowed = true
    },
    setUsername (state, payload) {
      state.username = payload.username
      state.fullname = payload.fullname
      state.logined = payload.logined
      state.roles = payload.roles
    }
  },
  actions: {
    showAlertMsg(context, payload) {
      // console.log(payload)
      if (payload.errMsgType === undefined) {
        context.state.errMsgType = 'warning'
      } else {
        context.state.errMsgType = payload.errMsgType
      }

      context.state.errMsg = payload.errMsg
      context.state.errAlert = true

      var timeout = payload.timeout
      if (timeout === undefined || timeout === null) timeout = 2500

      setTimeout(() => { context.state.errAlert = false }, timeout)
    },
    setWorkWxCode(context, payload) {
      console.log(payload)
      context.state.wxInfo.code = payload.code
      context.state.wxInfo.state = payload.state
      context.dispatch('getWorkWxUserId')
    },
    getWorkWxUserId(context) {
      const params = {
        'code': context.state.wxInfo.code,
        'state': context.state.wxInfo.state
      }
      authWorkWeixinUser(params, v => {
        context.dispatch('setWorkWxUserid', v)
      })
    }, 
    setWorkWxUserid(context, payload) {
      context.state.wxInfo.userid = payload.userid
      $.cookie('userid', payload.userid, { expires: 30, path: '/' })

      context.state.wxInfo.nickname = payload.name
      $.cookie('nickname', payload.name, { expires: 30, path: '/' })

      context.state.wxInfo.headimgurl = payload.avatar
      $.cookie('headimgurl', payload.avatar, { expires: 30, path: '/' })
    },     
  }
})
