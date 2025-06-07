import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: 0, // Giả lập đăng nhập
    role: "admin", // Giả lập quyền admin
    isChatVisible: false, // Toggle chat
    userInfo: {
      id: 0,
      name: "",
      email: "",
      phone: "",
      address: "",
      avatar: "",
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
      if (state.isAuthenticated && state.userInfo != null) {
        state.isChatVisible = true;
      }
    },
    hideChat(state) {
      state.isChatVisible = false;
    },
    toggleChat(state) {
      state.isChatVisible = !state.isChatVisible;
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo.id = userInfo.userId;
      state.userInfo.name = userInfo.fullName;
      state.userInfo.email = userInfo.email;
      state.userInfo.phone = userInfo.phone;
      state.userInfo.address = userInfo.address;
      state.userInfo.avatar = userInfo.avatar;
    },
  },
  actions: {
    login({ commit }, role) {
      commit("LOGIN", role);
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    setUserInfo({ commit }, userInfo) {
      commit("SET_USER_INFO", userInfo);
    },
  },
});
