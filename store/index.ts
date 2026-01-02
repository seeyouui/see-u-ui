// 页面路径：store/index.js
import { createStore } from 'vuex'
const store = createStore({
  state: {
    theme: ''
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
    }
  }
})

export default store
