import "./registerServiceWorker";

import Vue from "vue";
import moment from "moment";
import { AxiosHelper } from "@pranavraut033/js-utils";

import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";

import { isProduction } from "./utils";
import "./components";

const baseUrl = isProduction()
  ? process.env.VUE_APP_SERVER_URL
  : process.env.VUE_APP_DEBUG_SERVER_URL;

Vue.config.productionTip = false;

router.afterEach((to) => {
  window.document.title = to.meta.title || to.name || to.path;

  store.dispatch("app/setTitle", window.document.title);

  window.document.title += " | ClinaX";
});

Vue.mixin({
  data() {
    return {
      baseUrl,
    };
  },
  computed: {
    $axios() {
      return new AxiosHelper(baseUrl, store.state.token);
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isSuperSmall() {
      return this.$vuetify.breakpoint.xs;
    },
  },
  methods: {
    moment,
    makeRequest() {
      // eslint-disable-next-line prefer-rest-params
      return this.$axios.makeRequest.call(this.$axios, ...arguments);
    },
    log(ev) {
      if (!isProduction()) {
        // eslint-disable-next-line no-console
        console.log(ev);
      }
    },
    errorHandler(err) {
      store.state.app.snackbar.value = false;
      this.$nextTick(() => store.dispatch("app/errorHandler", err));
    },
    showSnackbar(message) {
      store.state.app.snackbar.value = false;
      this.$nextTick(() => store.dispatch("app/showSnackbar", message));
    },
    showError(message = "Something went wrong") {
      store.state.app.snackbar.value = false;
      this.$nextTick(() => store.dispatch("app/showError", message));
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  mounted() {
    if (store.state.token) store.dispatch("getUser", this.makeRequest);

    // todo: temporary fixed for 404 page on shortcut creation
    const location = window.location.pathname;
    if (location === "/icons/www.clinax.in/app") this.$router.replace("/");
  },
  render: (h) => h(App),
}).$mount("#app");
