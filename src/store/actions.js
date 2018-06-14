import axios from 'axios'

import { getWxOpenid, getWxUserInfo } from '../api/wx.js'

export const actions = {
  fetchItem ({ commit }, id) {
    // return the Promise via `store.dispatch()`   so that we know
    // when the data has been fetched
    // console.log(fetchItem)
    return fetchItem(id).then(item => {
      commit('setItem', { id, item })
    })
  },
  getAirports ({ commit }, sc) {
    axios.get('/api/data/airports', {
      params: sc
    }).then(v => {
      commit('setAirports', v.data)
    }).catch(function(error) {
    })
  },
  showAlertMsg(context, payload) {
    if (payload.errMsgType === undefined) {
      context.state.errMsgType = 'warning'
    } else {
      context.state.errMsgType = payload.errMsgType
    }

    context.state.errMsg = payload.errMsg
    context.state.errAlert = true

    let timeout = payload.timeout
    if (timeout === undefined || timeout === null) {
      if (payload.errMsgType === 'danger') {
        timeout = 5000
      } else {
        timeout = 2500  
      }      
    }

    setTimeout(() => { context.state.errAlert = false }, timeout)
  },
  setWxCode(context, payload) {
    context.state.wxInfo.code = payload
    context.dispatch('getWxOpenid')
  },
  getWxOpenid(context) {
    const params = { 'code': context.state.wxInfo.code }
    getWxOpenid(params, v => {
      context.dispatch('setWxOpenid', v.openid)
    })
  },
  setWxOpenid(context, payload) {
    context.state.wxInfo.openid = payload
    $.cookie('openid', payload, { expires: 30, path: '/' })

    context.dispatch('getWxUserInfo')
  },
  getWxUserInfo(context) {
    const params = { 'openid': context.state.wxInfo.openid }
    getWxUserInfo(params, v => {
      if (v !== null) {
        context.state.wxInfo.nickname = v.nickname
        $.cookie('nickname', v.nickname, { expires: 30, path: '/' })

        context.state.wxInfo.headimgurl = v.headimgurl
        $.cookie('headimgurl', v.headimgurl, { expires: 30, path: '/' })

        context.state.wxInfo.subscribe = v.subscribe
      }        
    })
  },
  setWwopenAuthCode(context, payload) {
    context.state.wwopen.authCode = payload
    // context.dispatch('getWxOpenid')
  }  
}
