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
const MyOrderBuyer   = resolve => require(['./pages/Order-buyer.vue'], resolve)
const MyOrderTicket  = resolve => require(['./pages/Order-ticketNo.vue'], resolve)
const MyOrderDeny    = resolve => require(['./pages/Order-deny.vue'], resolve)
const MyOrderRecommit= resolve => require(['./pages/Order-recommit.vue'], resolve)
const MyRefundRq     = resolve => require(['./pages/Order-refund-request.vue'], resolve)
const MyRefunds      = resolve => require(['./pages/Order-refunds.vue'], resolve)
const MyRefundDetail = resolve => require(['./pages/Order-refund-detail.vue'], resolve)
const MyChangeRq     = resolve => require(['./pages/Order-change-request.vue'], resolve)
const MyChanges      = resolve => require(['./pages/Order-changes.vue'], resolve)
const MyChangeDetail = resolve => require(['./pages/Order-change-detail.vue'], resolve)

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

const MyUpload      = () => System.import('./pages/Upload.vue')
const MyMaterials      = () => System.import('./pages/Materials.vue')
const MyPlay      = () => System.import('./pages/Media-play.vue')

const MyArtDetail    = resolve => require(['./pages/Article-detail.vue'], resolve)

const MyTripList    = resolve => require(['./pages/Trip-list.vue'], resolve)
const MyTripDetail    = resolve => require(['./pages/Trip-detail.vue'], resolve)
const MyTripBooking    = resolve => require(['./pages/TripBookingForm.vue'], resolve)
const MyTripOrders    = resolve => require(['./pages/Trip-orders.vue'], resolve)
const MyTripOrderDetail    = resolve => require(['./pages/Trip-order-detail.vue'], resolve)

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
  {path: '/order/:id/buyer',  component: MyOrderBuyer},
  {path: '/order/ticket',  component: MyOrderTicket},
  {path: '/order/deny',    component: MyOrderDeny},
  {path: '/order/recommit',component: MyOrderRecommit},
  {path: '/refunds',       component: MyRefunds},
  {path: '/refund/apply',  component: MyRefundRq},
  {path: '/refund/detail/:id', component: MyRefundDetail},
  {path: '/change/apply',  component: MyChangeRq},
  {path: '/changes',       component: MyChanges},
  {path: '/change/detail/:id', component: MyChangeDetail},


  {path: '/qinfo',         component: MyQinfo},
  {path: '/qinfo/list',    component: MyQinfoList},
  {path: '/qinfo/setting', component: MyQinfoSetting},
  {path: '/tmc',           component: MyTmc},
  {path: '/tmc/list',      component: MyTmcList},
  {path: '/tmc/buy',       component: MyTmcBuy},
  {path: '/tmc/detail',    component: MyTmcDetail},
  {path: '/pnr',           component: MyPnr},
  {path: '/pnr/list',      component: MyPnrList, meta: { keepAlive: true } },
  {path: '/pnr/stat',      component: MyPnrStat},
  {path: '/pnr/detail',    component: MyPnrDetail},
  {path: '/pnr/detail/:id',       component: MyPnrDetail},
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

  {path: '/upload',      component: MyUpload},
  {path: '/materials',      component: MyMaterials},
  {path: '/play/:id',      component: MyPlay},

  {path: '/article/:id',       component: MyArtDetail},

  {path: '/trips', component: MyTripList},
  {path: '/trip/:id', component: MyTripDetail},
  {path: '/trip/:id/:ddate', component: MyTripBooking},
  {path: '/trip-orders', component: MyTripOrders},
  {path: '/trip-order/:id', component: MyTripOrderDetail}
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

