import "./registerServiceWorker";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
import vuetify from "./plugins/vuetify";

import { baseUrl } from "./modules/request";
import { isProduction } from "./utils/";
import "./components";

Vue.config.productionTip = false;

router.afterEach((to) => {
  window.document.title = to.meta.title || to.name || to.path;

  store.dispatch("setTitle", window.document.title);

  window.document.title += " | ClinaX";
});

Vue.mixin({
  data() {
    return {
      baseUrl,
    };
  },
  methods: {
    moment,
    log(ev) {
      if (!isProduction()) {
        // eslint-disable-next-line no-console
        console.log(ev);
      }
    },
    errorHandler(err) {
      store.dispatch("errorHandler", err);
    },
    showSnackbar(message) {
      store.dispatch("showSnackbar", message);
    },
    showError(message = "Something went wrong") {
      store.dispatch("showError", message);
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  mounted() {
    if (store.state.token) store.dispatch("getUser");
  },
}).$mount("#app");
