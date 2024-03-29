import { errorHandler } from "@pranavraut033/js-utils/utils/AxiosHelper";

export const namespaced = true;

const _state = () => ({
  title: "ClinaX",
  snackbar: { value: false },
  navbar: true,
  extentedAppBar: false,
  extensionHeight: 78,
  navbarVisibility: true,
  appbarVisibility: true,

  serviceWorkerState: null,
});

export { _state as state };

export const mutations = {
  title: (state, value) => (state.title = value),
  snackbar: (state, value) => (state.snackbar = value),
  appbarVisibility: (state, value) => (state.appbarVisibility = value),
  extentedAppBar: (state, value) => (state.extentedAppBar = value),
  navbarVisibility: (state, value) => (state.navbarVisibility = value),
  hideSnackbar: (state) => (state.snackbar.value = false),
  setServiceWorkerState(state, serviceWorkerState) {
    state.app.serviceWorkerState = serviceWorkerState;

    switch (serviceWorkerState) {
      case "cached":
        this.dispatch("showSnackbar", "Website has been Cached");
        break;
      case "updatefound":
        this.dispatch("showSnackbar", "Downloading website updates");
        break;
      case "updated":
        if (localStorage.getItem("clinax.updated") !== "true") {
          window.location.reload();
          localStorage.setItem("clinax.updated", true);
        } else {
          localStorage.setItem("clinax.updated", false);
          this.dispatch("showSnackbar", "Site Just got Updated");
        }
        break;
      case "offline":
        this.dispatch(
          "showSnackbar",
          "You are offline, Connect to internet for the website to functin properly"
        );
        break;
      case "ready":
      case "registered":
      case "error":
      default:
        break;
    }
  },
};

export const actions = {
  setTitle: ({ commit }, title) => commit("title", title),
  hideUI: ({ commit }) => {
    commit("appbarVisibility", false);
    commit("navbarVisibility", false);
  },
  showUI: ({ commit }) => {
    commit("appbarVisibility", true);
    commit("navbarVisibility", true);
  },
  hideExtension: ({ commit }) => commit("extentedAppBar", false),
  showExtension: ({ commit }) => commit("extentedAppBar", true),

  errorHandler({ dispatch }, err) {
    // eslint-disable-next-line global-require
    dispatch("showError", { message: errorHandler(err) });
  },
  showSnackbar({ commit }, { message, btnText = null, callback = null }) {
    commit("snackbar", {
      value: true,
      message,
      btnText,
      callback,
    });
  },
  showError(
    { commit },
    { message = "Something went wrong", btnText = null, callback = null }
  ) {
    commit("snackbar", {
      value: true,
      error: true,
      message,
      btnText,
      callback,
    });
  },
};
