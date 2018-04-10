import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router/router.js'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

// export a factory function for creating fresh app, router and store
// instances
export function createApp() {
  // create router and store instances
  const router = createRouter();
  const store = createStore()

  // sync so that route state is available as part of the store
  sync(store, router)

  // create the app instance, injecting both the router and the store
  const app = new Vue({
    router,
    store,
    // the root instance simply renders the App component.
    render: h => h(App)
  });

  // expose the app, the router and the store.
  return { app, router, store };
}