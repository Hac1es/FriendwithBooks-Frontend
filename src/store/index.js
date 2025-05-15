import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: true, // Giả lập luôn đăng nhập
    role: "admin", // Giả lập quyền admin
  },
  mutations: {
    LOGIN(state, role) {
      state.isAuthenticated = true;
      state.role = role;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.role = "";
    },
  },
  actions: {
    login({ commit }, role) {
      commit("LOGIN", role);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
});
