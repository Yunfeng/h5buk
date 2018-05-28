import Vue from 'vue';
import Router from 'vue-router';

import MyNav from '../pages/Nav.vue';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: MyNav},

      { path: '/login', component: () => import('../pages/Login.vue')},
      { path: '/subscribe', component: () => import('../pages/Register2.vue')},
      { path: '/profile', component: () => import('../pages/Profile.vue')},

      { path: '/recharge', component: () => import('../pages/Recharge.vue')},
      { path: '/payresult/:id', component: () => import('../pages/Recharge-result.vue')},

      { path: '/orders', component: () => import('../pages/Orders.vue'), meta: { keepAlive: true } },
      { path: '/order/:id', component: () => import('../pages/Order-detail.vue') },

      { path: '/search', component: () => import('../pages/FlightSearchForm.vue')},
      { path: '/searchResult', component: () => import('../pages/FlightSearchResult.vue')},
      { path: '/flight/detail', component: () => import('../pages/FlightDetail.vue')},
      { path: '/booking', component: () => import('../pages/FlightBookingForm.vue')},

      { path: '/policies', component: () => import('../pages/Tmc-list.vue')},
      { path: '/policy/:id', component: () => import('../pages/Tmc-detail.vue')},
      { path: '/policy/:id/buy', component: () => import('../pages/Tmc-buy.vue')}
    ]
  });
}
