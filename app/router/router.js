import Vue from 'vue';
import Router from 'vue-router';

import MyNav from '../pages/Nav.vue';

const Login = () => import('../pages/Login.vue')
const Subscribe = () => import('../pages/Register2.vue')
const Profile = () => import('../pages/Profile.vue')

const Orders = () => import('../pages/Orders.vue')
const OrderDetail = () => import('../pages/Order-detail.vue')
const FlightDetail = () => import('../pages/FlightDetail.vue')

const Recharge = () => import('../pages/Recharge.vue')
const MyPayResult = () => import('../pages/Recharge-result.vue')

const Policies = () => import('../pages/Tmc-list.vue')
const PolicyDetail = () => import('../pages/Tmc-detail.vue')
const BuyTmcPolicy = () => import('../pages/Tmc-buy.vue')

const FlightBookingForm1 = () => import('../pages/FlightBookingForm.vue')

const FlightSearchForm = () => import('../pages/FlightSearchForm.vue')
const FlightSearchResult = () => import('../pages/FlightSearchResult.vue')

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: MyNav},

      { path: '/login', component: Login},
      { path: '/subscribe', component: Subscribe},
      { path: '/profile', component: Profile},

      { path: '/recharge', component: Recharge},
      { path: '/payresult/:id', component: MyPayResult},

      { path: '/orders', component: Orders, meta: { keepAlive: true } },
      { path: '/order/:id', component: OrderDetail },

      { path: '/search', component: FlightSearchForm},
      { path: '/searchResult', component: FlightSearchResult},
      { path: '/flight/detail', component: FlightDetail},
      { path: '/booking', component: FlightBookingForm1},

      { path: '/policies', component: Policies},
      { path: '/policy/:id', component: PolicyDetail},
      { path: '/policy/:id/buy', component: BuyTmcPolicy}
    ]
  });
}
