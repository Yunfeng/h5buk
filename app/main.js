import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Tabbar from './components/my-tabbar.vue'
import MyHome from './pages/Home.vue'
import $ from 'jquery'
require('./main.css')

Vue.use(Router)
Vue.use(Vuex)

const MyLogin        = resolve => require(['./pages/Login.vue'], resolve)
const MyRegister     = resolve => require(['./pages/Register.vue'], resolve)
const MyPassword     = resolve => require(['./pages/Password.vue'], resolve)
const MySearchForm   = resolve => require(['./pages/FlightSearchForm.vue'], resolve)
const MySearchResult = resolve => require(['./pages/FlightSearchResult.vue'], resolve)
const MyBookingForm  = resolve => require(['./pages/FlightBookingForm.vue'], resolve)
const MyOrder        = resolve => require(['./pages/Order.vue'], resolve)
const MyOrderSale    = resolve => require(['./pages/Order-sale.vue'], resolve)
const MyOrderDetail  = resolve => require(['./pages/Order-detail.vue'], resolve)
const MyOrderTicket  = resolve => require(['./pages/Order-ticketNo.vue'], resolve)
const MyOrderDeny    = resolve => require(['./pages/Order-deny.vue'], resolve)
const MyOrderRecommit= resolve => require(['./pages/Order-recommit.vue'], resolve)
const MyQinfo        = resolve => require(['./pages/Qinfo.vue'], resolve)
const MyQinfoList    = resolve => require(['./pages/Qinfo-list.vue'], resolve)
const MyQinfoSetting = resolve => require(['./pages/Qinfo-setting.vue'], resolve)
const MyTmc          = resolve => require(['./pages/Tmc.vue'], resolve)
const MyTmcList      = resolve => require(['./pages/Tmc-list.vue'], resolve)
const MyTmcBuy       = resolve => require(['./pages/Tmc-buy.vue'], resolve)
const MyTmcDetail    = resolve => require(['./pages/Tmc-detail.vue'], resolve)
const MyPnr          = resolve => require(['./pages/Pnr.vue'], resolve)
const MyPnrList      = resolve => require(['./pages/Pnr-list.vue'], resolve)
const MyPnrDetail    = resolve => require(['./pages/Pnr-detail.vue'], resolve)
const MyPnrAlert1    = resolve => require(['./pages/Pnr-alert1.vue'], resolve)
const MyPnrCtcm      = resolve => require(['./pages/Pnr-ctcm.vue'], resolve)
const MyEterm        = resolve => require(['./pages/Eterm.vue'], resolve)
const MyNav          = resolve => require(['./pages/Nav.vue'], resolve)

const routes = [
  {path: '/',              component: MyNav},
  {path: '/home',          component: MyHome},
  {path: '/login',         component: MyLogin},
  {path: '/register',      component: MyRegister},
  {path: '/password',      component: MyPassword},
  {path: '/search',        component: MySearchForm},
  {path: '/searchResult',  component: MySearchResult},
  {path: '/booking',       component: MyBookingForm},
  {path: '/order',         component: MyOrder},
  {path: '/order/sale',    component: MyOrderSale},
  {path: '/order/detail',  component: MyOrderDetail},
  {path: '/order/ticket',  component: MyOrderTicket},
  {path: '/order/deny',    component: MyOrderDeny},
  {path: '/order/recommit',component: MyOrderRecommit},
  {path: '/qinfo',         component: MyQinfo},
  {path: '/qinfo/list',    component: MyQinfoList},
  {path: '/qinfo/setting', component: MyQinfoSetting},
  {path: '/tmc',           component: MyTmc},
  {path: '/tmc/list',      component: MyTmcList},
  {path: '/tmc/buy',       component: MyTmcBuy},
  {path: '/tmc/detail',    component: MyTmcDetail},
  {path: '/pnr',           component: MyPnr},
  {path: '/pnr/list',      component: MyPnrList},
  {path: '/pnr/detail',    component: MyPnrDetail},
  {path: '/pnr/alert1',    component: MyPnrAlert1},
  {path: '/pnr/ctcm',      component: MyPnrCtcm},
  {path: '/eterm',         component: MyEterm},
]

let router = new Router({
  routes: routes
});

const store = new Vuex.Store({
  state: {
    logined: false,
    username: '',
    searchParams: {
      dcity: '',
      dcityName: '',
      acity: '',
      acityName: '',
      ddate: ''
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

    //pnr ctcm list page

  },
  mutations: {
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
      state.username = "",
      state.logined = false;

      $.removeCookie('username', { path: '/' }); 
      $.removeCookie('token', { path: '/' }); 
    },
    setUsername (state, payload) {
      state.username = payload.username;
      state.logined = payload.logined;
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
    addFlight(state, payload) {
      state.order.flights.push(payload);
      if (state.order.psgs.length === 0) {
        state.order.psgs.push({psgName:'', idNo: '', idType: 1});
      }
    },
    addPsg(state, p) {
      //console.log(p);
      
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
    }
  }
})

const app = new Vue({
  el: '#app',
  store,
  components: {
    'my-tabbar': Tabbar
  },
  router: router
})

