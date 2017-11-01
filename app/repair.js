import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import TopTips from './components/my-top-tips.vue'
import MyLoading from './components/my-loading.vue'
import MyHome from './pages/Home.vue'
import MySidebar from './components/my-sidebar.vue'
import $ from 'jquery'
import store from './store'
require('./main.css')

Vue.use(Router)

/* eslint-disable */
const MyNav          = resolve => require(['./pages/Nav.vue'], resolve)
const MyLogin        = resolve => require(['./pages/LoginOfRepair.vue'], resolve)
const MyRepairIssues = resolve => require(['./pages/RepairIssuesOfAdmin.vue'], resolve)

const routes = [
  {path: '/',              component: MyNav},
  {path: '/login',         component: MyLogin},
  {path: '/repair/issues', component: MyRepairIssues}
]

let router = new Router({
  routes: routes
});


const app = new Vue({
  el: '#app',
  store,
  components: {
    'my-top-tips': TopTips,
    'my-sidebar': MySidebar,
    'my-loading': MyLoading
  },
  router: router
})

