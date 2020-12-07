
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    errors: []
  },
  mutations: {
    setErrors(state,errors){
        state.errors = errors;
    }
  },
  getters: {
    allErrors: state => {
        return state.errors;
    }
  }
})

export default store;