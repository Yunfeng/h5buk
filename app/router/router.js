import Vue from 'vue';
import Router from 'vue-router';

import MyNav from '../pages/Nav.vue';
import About from '../pages/About.vue';
import Login from '../pages/Login.vue';
import Orders from '../pages/Orders.vue';
import OrderDetail from '../pages/Order-detail.vue';
import FlightDetail from '../pages/FlightDetail.vue';

import Recharge from '../pages/Recharge.vue';
import MyPayResult from '../pages/Recharge-result.vue';



Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: MyNav},
      { path: '/about', component: About},
      { path: '/login', component: Login},

      { path: '/recharge', component: Recharge},
      { path: '/payresult/:id', component: MyPayResult},

      { path: '/orders', component: Orders, meta: { keepAlive: true } },
      { path: '/order/:id', component: OrderDetail },

      { path: '/search', component: () => System.import('../pages/FlightSearchForm.vue')},
      { path: '/searchResult', component: () => System.import('../pages/FlightSearchResult.vue')},
      { path: '/flight/detail', component: FlightDetail},
      { path: '/booking', component: () => System.import('../pages/FlightBookingForm.vue')}
    ]
  });
}
