import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: true, // Giả lập đăng nhập
    role: "user", // Giả lập quyền admin
    isChatVisible: false, // Toggle chat
    userInfo: {
      id: 20,
      name: "Nguyễn Viết Tùng",
      email: "nchinhtung@gmail.com",
      phone: "0909090909",
      address: "Hà Nội",
      avatar: `https://i.pravatar.cc/150?img=20`,
    },
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
