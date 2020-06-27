import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

// import { getDownloadPath } from "./modules/firebaseStorage";
import { makeRequest, errorHandler } from "./modules/request";
import { setInColorMap, getFromColorMap } from "./utils";
import { decompressFromUTF16 } from "lz-string";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem("clinax.token"),
    followUpsEvents: {},
    app: {
      title: "ClinaX",
      snackbar: { value: false },
      navbar: true,
      extentedAppBar: false,
      extensionHeight: 78,
      navbarVisibility: true,
      appbarVisibility: true,
    },
    listeners: {
      eventChange: {},
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
      // if (user) {
      //   ["avatar"].forEach((key) => {
      //     if (key in user) {
      //       if (!user[key].includes("img") && !user[key].includes("firebase")) {
      //         getDownloadPath(user[key])
      //           .then((path) => (user[key] = path))
      //           .catch(() => (user[key] = `/img/${key}.jpg`));
      //         user[key] = "";
      //       }
      //     } else user[key] = `/img/${key}.jpg`;
      //   });
      // }

      state.user = user;

      state.app.userUpdateLoading = false;
    },
    setEvents(state, data) {
      data = JSON.parse(decompressFromUTF16(data));

      let a = {};
      for (const date in data) {
        if (data.hasOwnProperty(date)) {
          const element = data[date];

          element.forEach((ev) => {
            setInColorMap(ev._id, ev.color);
            a[ev.followUpId || ev.appointmentId] = ev;
          });
        }
      }

      state.followUpsEvents = a;
      Object.values(state.listeners.eventChange).forEach((ev) => {
        ev && typeof ev == "function" && ev();
      });
    },
    addEvent(state, data) {
      let date = moment(data.date);
      data.date = date.format("YYYY-MM-DD");
      data.start = date.format("YYYY-MM-DD hh:mm");
      data.end = date.endOf("day").format("YYYY-MM-DD hh:mm");
      data.color = getFromColorMap(data._id);

      state.followUpsEvents[data.followUpId] = data;

      Object.values(state.listeners.eventChange).forEach((ev) => {
        ev && typeof ev == "function" && ev();
      });
    },
  },
  getters: {
    events(state) {
      let a = {};

      Object.values(state.followUpsEvents).forEach((ev) => {
        a[ev.date] || (a[ev.date] = []);

        a[ev.date].push(ev);
      });

      return a;
    },
  },
  actions: {
    addListener({ state }, { event, name, callback }) {
      state.listeners[event][name] = callback;
    },

    getUser() {
      makeRequest("get", "self", (res) => {
        store.commit("setUser", res.data);
      }).catch((err) => {
        store.commit("setUser", {});
        store.commit("setToken", null);
        store.dispatch("errorHandler", err);
      });
    },
    logout() {
      sessionStorage.clear();

      store.commit("setUser", null);
      store.commit("setToken", null);
    },

    // UI actions
    setTitle: ({ state }, title) => (state.app.title = title),
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
