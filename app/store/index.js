import Vue from 'vue'
import Vuex from 'vuex'

import { state } from './state.js'
import { mutations } from './mutations.js'
import { actions } from './actions.js'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state,
    mutations,
    actions
  })
}
