import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bottomTabBarShowed: true,
    logined: false,
    username: '',
    fullname: '',
    searchParams: {
      dcity: '',
      dcityName: '',
      acity: '',
      acityName: '',
      ddate: '',
      sortBy: 0,
      onlyCarrier: '',
    },
    order: {
      flights: [],
      psgs: [],
      pnrNo: '',
      pnrDetail: '',
      policyId: 0
    },
    historyStep: 0,
    userInfo: {
      freeBalance: 0,
      cashBalance: 0,
      frozenBalance: 0,
      creditLimit: 0
    },
    orderId: 0,
    orderDetail: null,
    policyDetail: null,
    pnrDetail: null,

    errAlert: false,
    errMsg: '',
    errMsgType: 'warning',
    
    loading: false,
    loadingText: '数据加载中',

    wxInfo: {
      code: '',
      openid: '',
      nickname: '',
      headimgurl: '',
      subscribe: 0
    },
    // 申请退票信息
    refundInfo: {
      ticketNo: '',
      psgName: '',
      orderId: 0
    },
    // 申请改期信息
    changeInfo: {
      ticketNo: '',
      psgName: '',
      orderId: 0
    },
    refundOrderInfo: null,
    changeOrderInfo: null
  },
  mutations: {
    init (state) {
      // 初始化，读取cookie中的数据
      var username = $.cookie('username')
      if (username !== undefined) {
        state.username = username
        state.logined = true
      }

      var openid = $.cookie('openid')
      if (openid !== undefined) {
        state.wxInfo.openid = openid

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
    resetOrderInfo (state) {
      state.order.pnrNo = ''
      state.order.pnrDetail = ''
      state.order.policyId = 0
      state.order.flights.splice(0)
      state.order.psgs.splice(0)
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
    },
    setUsername (state, payload) {
      state.username = payload.username
      state.fullname = payload.fullname
      state.logined = payload.logined
    },
    setUserInfo(state, payload) {
      state.userInfo.freeBalance = payload.balance;
      state.userInfo.cashBalance = payload.cashBalanceYuan;
      state.userInfo.frozenBalance = payload.frozenBalanceYuan;
      state.userInfo.creditLimit = payload.creditLimitYuan;
    },
    setDcity(state, payload) {
      state.searchParams.dcity = payload.cityCode;
      state.searchParams.dcityName = payload.cityName;
    },
    setAcity(state, payload) {
      state.searchParams.acity = payload.cityCode;
      state.searchParams.acityName = payload.cityName;
    },
    setDdate(state, payload) {
      state.searchParams.ddate = payload;
    }, 
    switchCity(state) {
      var cityCode = state.searchParams.acity
      var cityName = state.searchParams.acityName

      state.searchParams.acity = state.searchParams.dcity
      state.searchParams.acityName = state.searchParams.dcityName

      state.searchParams.dcity = cityCode
      state.searchParams.dcityName = cityName
    },
    setOnlyCarrier(state, payload) {
      state.searchParams.onlyCarrier = payload
    },
    setSortBy(state, payload) {
      state.searchParams.sortBy = payload
    },
    addFlight(state, payload) {
      state.order.flights.push(payload);
      if (state.order.psgs.length === 0) {
        state.order.psgs.push({psgName:'', idNo: '', idType: 1});
      }
    },
    addPsg(state, p) {
      if (p === undefined || p === null) {
        p = {psgName:'', idNo: '', idType: 1};
      }

      state.order.psgs.push(p);
    },
    updatePsg(state, p) {
      state.order.psgs[p.index].psgName = p.name;
      state.order.psgs[p.index].idType = p.idType;
      state.order.psgs[p.index].idNo = p.idNo;
    },    
    deletePsg(state, index) {
      state.order.psgs.splice(index, 1);
      if (state.order.psgs.length === 0) {
        state.order.psgs.push({psgName:'', idNo: '', idType: 1});
      }
    },
    deleteFlt(state, index) {
      state.order.flights.splice(index, 1);
    },
    setOrderInfo(state, payload) {
      state.order.pnrNo = payload.pnrNo;
      state.order.pnrDetail = payload.pnrDetail;
      state.order.policyId = payload.policyId;
    },
    setOrderId(state, id) {
      state.orderDetail = null;
      state.orderId = id;
    },
    setOrderDetail(state, payload) {
      state.orderDetail = payload;
      state.orderId = payload.id;
    },
    setPolicyDetail(state, payload) {
      state.policyDetail = payload;
    },
    setPnrDetail(state, payload) {
      state.pnrDetail = payload;
    },
    showLoading(state, payload) {
      state.loading = payload.loading
      if (payload.loadingText === undefined) {
        state.loadingText = '数据加载中...'
      } else {
        state.loadingText = payload.loadingText  
      }
    },
    setRefundInfo(state, payload) {
      state.refundInfo.ticketNo = payload.ticketNo
      state.refundInfo.psgName = payload.psgName
      state.refundInfo.orderId = payload.orderId
    },
    setChangeInfo(state, payload) {
      state.changeInfo.ticketNo = payload.ticketNo
      state.changeInfo.psgName = payload.psgName
      state.changeInfo.orderId = payload.orderId
    },
    setRefundOrderInfo(state, payload) {
      state.refundOrderInfo = payload
    },
    setChangeOrderInfo(state, payload) {
      state.changeOrderInfo = payload
    },
    selectPolicy(state, p) {
      // console.log(p)
      state.orderDetail.policyId = p.policyId
      state.orderDetail.policyReturnPoint = p.returnPoint
      state.orderDetail.returnMoney = p.returnMoney

      var price = state.orderDetail.flights[0].price
      var psgCount = state.orderDetail.psgCount

      state.orderDetail.ticketAmount = Math.round((price * (100 - p.returnPoint) / 100 - p.returnMoney + 50) * psgCount)
    },
    hideBottomTabBar(state) {
      state.bottomTabBarShowed = false
    },
    showBottomTabBar(state) {
      state.bottomTabBarShowed = true
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
    setWxCode(context, payload) {
      context.state.wxInfo.code = payload
      context.dispatch('getWxOpenid')
    },
    getWxOpenid(context) {
      $.ajax({
        type: 'post',
        url: '/Flight/weixin/getOpenId',
        data: {
          'code': context.state.wxInfo.code
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            context.dispatch('setWxOpenid', jsonResult.openid)
          }
        }
      })   
    },
    setWxOpenid(context, payload) {
      context.state.wxInfo.openid = payload
      $.cookie('openid', payload, { expires: 30, path: '/' })

      context.dispatch('getWxUserInfo')
    },
    getWxUserInfo(context) {
      $.ajax({
        type: 'post',
        url: '/Flight/weixin/getUserInfo',
        data: {
          'openid': context.state.wxInfo.openid
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            context.state.wxInfo.nickname = jsonResult.nickname
            $.cookie('nickname', jsonResult.nickname, { expires: 30, path: '/' })

            context.state.wxInfo.headimgurl = jsonResult.headimgurl
            $.cookie('headimgurl', jsonResult.headimgurl, { expires: 30, path: '/' })

            context.state.wxInfo.subscribe = jsonResult.subscribe
          }
        }
      })   
    }      
  }
})
