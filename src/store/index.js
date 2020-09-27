import Vue from "vue";
import Vuex from "vuex";

import * as app from "@/store/app";
import * as followUpsEvents from "@/store/followUpsEvents";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { app, followUpsEvents },
  state: {
    user: null,
    token: localStorage.getItem("clinax.token"),
  },
  mutations: {
    // AUTH
    setToken: (state, token) => {
      localStorage.setItem("clinax.token", (state.token = token));

      if (token && (!state.user || state.user.token !== token))
        store.dispatch("getUser");
    },
    setUser: (state, user) => {
      state.user = user;

      state.app.userUpdateLoading = false;
    },
  },
  actions: {
    deleteAppointment(_, { id, makeRequest }) {
      return makeRequest("delete", "appointment", { id });
    },
    getUser({ commit, dispatch }, makeRequest) {
      makeRequest("get", "self", (res) => {
        commit("setUser", res.data);
      }).catch((err) => {
        commit("setUser", {});
        commit("setToken", null);
        dispatch("app/errorHandler", err);
      });
    },
    logout({ commit }) {
      sessionStorage.clear();

      commit("setUser", null);
      commit("setToken", null);
    },
  },
});

export default store;
