import Vue from "vue";
import Vuex from "vuex";
import { makeRequest, errorHandler } from "./modules/request";
import { getDownloadPath } from "./modules/firebaseStorage";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem("clinax.token"),
    app: {
      title: "ClinaX",
      snackbar: { value: false },
    },
  },
  mutations: {
    // AUTH
    setToken: (state, token) => {
      localStorage.setItem("clinax.token", (state.token = token));

      if (token && (!state.user || state.user.token != token))
        store.dispatch("getUser");
    },
    setUser: (state, user) => {
      if (user) {
        ["avatar"].forEach((key) => {
          if (user[key]) {
            if (!user[key].includes("img") && !user[key].includes("firebase")) {
              getDownloadPath(user[key])
                .then((path) => (user[key] = path))
                .catch(() => (user[key] = `/img/${key}.jpg`));
              user[key] = "";
            }
          } else user[key] = `/img/${key}.jpg`;
        });
      }

      state.user = user;

      state.app.userUpdateLoading = false;
    },
  },
  actions: {
    setTitle: ({ state }, title) => (state.app.title = title + " | ClinaX"),

    getUser() {
      makeRequest("get", "self", (res) => {
        store.commit("setUser", res.data);
      }).catch((err) => {
        store.commit("setUser", {});
        store.commit("setToken", null);
        store.dispatch("errorHandler", err);
      });
    },
    errorHandler(_, err) {
      this.dispatch("showError", errorHandler(err));
    },
    showSnackbar({ state }, message) {
      state.app.snackbar.value = false;

      state.app.snackbar = { value: true, message };
    },
    showError({ state }, message = "Something went wrong") {
      state.app.snackbar.value = false;

      state.app.snackbar = {
        value: true,
        message,
        error: true,
      };
    },
  },
});
export default store;
