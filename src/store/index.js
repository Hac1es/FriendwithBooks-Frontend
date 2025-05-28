import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false, // Giả lập đăng nhập
    role: "", // Giả lập quyền admin
    isChatVisible: false, // Toggle chat
  },
  mutations: {
    // Login section
    LOGIN(state, role) {
      state.isAuthenticated = true;
      state.role = role;
    },
    LOGOUT(state) {
      state.isAuthenticated = false;
      state.role = "";
    },
    //Chat section
    showChat(state) {
      state.isChatVisible = true;
    },
    hideChat(state) {
      state.isChatVisible = false;
    },
    toggleChat(state) {
      state.isChatVisible = !state.isChatVisible;
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
