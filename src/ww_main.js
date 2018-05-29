import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import Tabbar from './ww/components/my-tabbar.vue'
import TopTips from './components/my-top-tips.vue'
import MyLoading from './components/my-loading.vue'
import $ from 'jquery'
import store from './ww/store'
require('./main.css')

Vue.use(Router)

/* eslint-disable */
const MyNav          = resolve => require(['./ww/pages/Nav.vue'], resolve)
const MyLogin        = resolve => require(['./ww/pages/Login.vue'], resolve)
const MyRegister     = resolve => require(['./pages/Register.vue'], resolve)
const MyPassword     = resolve => require(['./pages/Password.vue'], resolve)

const MyQinfoList    = resolve => require(['./pages/Qinfo-list.vue'], resolve)
const MyQinfoSetting = resolve => require(['./pages/Qinfo-setting.vue'], resolve)

const MyPnrList      = resolve => require(['./pages/Pnr-list.vue'], resolve)
const MyPnrDetail    = resolve => require(['./pages/Pnr-detail.vue'], resolve)

const routes = [
  {path: '/',              component: MyNav},
  {path: '/login',         component: MyLogin},
  {path: '/register',      component: MyRegister},
  {path: '/password',      component: MyPassword},

  {path: '/qinfos',    component: MyQinfoList},
  {path: '/qinfo/setting', component: MyQinfoSetting},

  {path: '/pnrs',      component: MyPnrList, meta: { keepAlive: true } },
  {path: '/pnr/:id',       component: MyPnrDetail}
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
    'my-loading': MyLoading
  },
  router: router
})

