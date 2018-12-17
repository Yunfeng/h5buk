import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      // { path: '/', component: () => import('../pages/Nav.vue')},
      { path: '/', redirect: '/wwopen'},

      { path: '/login', component: () => import('../pages/Login.vue')},

      // { path: '/subscribe', component: () => import('../pages/Register2.vue')},
      // { path: '/corp-subscribe', component: () => import('../pages/RegisterCorp.vue')},
      // { path: '/profile', component: () => import('../pages/Profile.vue')},

      // { path: '/recharge', component: () => import('../pages/Recharge.vue')},
      // { path: '/payresult/:id', component: () => import('../pages/Recharge-result.vue')},

      { path: '/orders', component: () => import('../pages/Orders.vue'), meta: { keepAlive: true } },
      { path: '/order/:id', component: () => import('../pages/Order-detail.vue') },

      { path: '/search', component: () => import('../pages/FlightSearchForm.vue')},
      { path: '/searchResult', component: () => import('../pages/FlightSearchResult.vue'), meta: { keepAlive: true }},
      { path: '/flight/detail', component: () => import('../pages/FlightDetail.vue')},
      { path: '/booking', component: () => import('../pages/FlightBookingForm.vue')},

      // { path: '/policies', component: () => import('../pages/Tmc-list.vue')},
      // { path: '/policy/:id', component: () => import('../pages/Tmc-detail.vue')},
      // { path: '/policy/:id/buy', component: () => import('../pages/Tmc-buy.vue')},

      { path: '/wwopen', component: () => import('../wwopen/pages/Nav.vue')},
      { path: '/wwopen/login', component: () => import('../wwopen/pages/Login.vue')},
      { path: '/wwopen/departments', component: () => import('../wwopen/pages/Departments.vue')},
      { path: '/wwopen/users', component: () => import('../wwopen/pages/Users.vue')}
    ]
  });
}
