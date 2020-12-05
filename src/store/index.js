import Vuex from 'vuex'

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