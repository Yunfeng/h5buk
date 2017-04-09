import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Tabbar from './components/my-tabbar.vue'
import TopTips from './components/my-top-tips.vue'
import MyLoading from './components/my-loading.vue'
import MyHome from './pages/Home.vue'
import MySidebar from './components/my-sidebar.vue'
import $ from 'jquery'
import store from './store'
require('./main.css')

Vue.use(Router)

/* eslint-disable */
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
// const MyTmc          = resolve => require(['./pages/Tmc.vue'], resolve)
const MyTmc = () => System.import('./pages/Tmc.vue')
const MyTmcList      = resolve => require(['./pages/Tmc-list.vue'], resolve)
const MyTmcBuy       = resolve => require(['./pages/Tmc-buy.vue'], resolve)
const MyTmcDetail    = resolve => require(['./pages/Tmc-detail.vue'], resolve)
const MyPnr          = resolve => require(['./pages/Pnr.vue'], resolve)
const MyPnrList      = resolve => require(['./pages/Pnr-list.vue'], resolve)
const MyPnrStat      = resolve => require(['./pages/Pnr-stat.vue'], resolve)
const MyPnrDetail    = resolve => require(['./pages/Pnr-detail.vue'], resolve)
const MyPnrAlert1    = resolve => require(['./pages/Pnr-alert1.vue'], resolve)
const MyPnrCtcm      = resolve => require(['./pages/Pnr-ctcm.vue'], resolve)
const MyPnrCtct      = resolve => require(['./pages/Pnr-ctct.vue'], resolve)
const MyPnrMobile = () => System.import('./pages/Pnr-mobile.vue')
const MyPnrSyslog = () => System.import('./pages/Pnr-syslog.vue')
const MyEterm        = resolve => require(['./pages/Eterm.vue'], resolve)
const MyNav          = resolve => require(['./pages/Nav.vue'], resolve)
const MyRecharge      = () => System.import('./pages/Recharge.vue')
const MyPayResult     = () => System.import('./pages/Recharge-result.vue')

const MyTpr    = resolve => require(['./pages/Tpr.vue'], resolve)

const MyCtrp    = resolve => require(['./pages/Ctrip.vue'], resolve)
const MyCtrpPolicies    = resolve => require(['./pages/Ctrip-policies.vue'], resolve)
const MyCtrpPrice    = resolve => require(['./pages/Ctrip-price.vue'], resolve)
const MyCtrpSync    = resolve => require(['./pages/Ctrip-sync-policy.vue'], resolve)
const MyCtrpPolicyDetail    = resolve => require(['./pages/Ctrip-policy-detail.vue'], resolve)

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
  {path: '/order/detail/:id',  component: MyOrderDetail},
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
  {name: 'pnrList',   path: '/pnr/list',      component: MyPnrList},
  {path: '/pnr/stat',      component: MyPnrStat},
  {path: '/pnr/detail',    component: MyPnrDetail},
  {name: 'pnrDetail', path: '/pnr/detail/:id',       component: MyPnrDetail},
  {path: '/pnr/alert1',    component: MyPnrAlert1},
  {path: '/pnr/ctcm',      component: MyPnrCtcm},
  {path: '/pnr/ctct',      component: MyPnrCtct},
  {path: '/pnr/syslog',    component: MyPnrSyslog},
  {path: '/pnr/mobile',    component: MyPnrMobile},
  {path: '/eterm',         component: MyEterm},
  {path: '/recharge',      component: MyRecharge},
  {path: '/payresult/:id',      component: MyPayResult},
  {path: '/tpr',      component: MyTpr},
  {path: '/ctrp',      component: MyCtrp},
  {path: '/ctrp/policies',      component: MyCtrpPolicies},
  {path: '/ctrp/policy/:id',      component: MyCtrpPolicyDetail},
  {path: '/ctrp/price',      component: MyCtrpPrice},
  {path: '/ctrp/sync',      component: MyCtrpSync},
]

let router = new Router({
  routes: routes
});


const app = new Vue({
  el: '#app',
  store,
  components: {
    'my-tabbar': Tabbar,
    'my-top-tips': TopTips,
    'my-sidebar': MySidebar,
    'my-loading': MyLoading
  },
  router: router
})

