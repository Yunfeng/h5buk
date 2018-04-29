import Vue from 'vue';
import Router from 'vue-router';

import About from '../pages/About.vue';
import Login from '../pages/Login.vue';
import Orders from '../pages/Orders.vue';
import OrderDetail from '../pages/Order-detail.vue';
import FlightDetail from '../pages/FlightDetail.vue';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => System.import('../pages/Home.vue')},
      { path: '/about', component: About},
      { path: '/login', component: Login},

      { path: '/orders', component: Orders, meta: { keepAlive: true } },
      { path: '/order/:id', component: OrderDetail },

      { path: '/search', component: () => System.import('../pages/FlightSearchForm.vue')},
      { path: '/searchResult', component: () => System.import('../pages/FlightSearchResult.vue')},
      { path: '/flight/detail', component: FlightDetail},
      { path: '/booking', component: () => System.import('../pages/FlightBookingForm.vue')}
    ]
  });
}
