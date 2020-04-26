import "./registerServiceWorker";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueClipboard from "vue-clipboard2";
import draggable from "vuedraggable";
import VueMask from "v-mask";

import "./components";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(VueMask);
Vue.use(VueClipboard);
Vue.component("draggable", draggable);

router.afterEach((to) => {
  window.document.title = to.meta.title || to.name || to.path;

  store.dispatch("setTitle", window.document.title);
});

router.beforeEach((to, _, next) => {
  if (!store.state.token) next();

  if (!to.matched.length) next("/404");
  else next();
});

Vue.mixin({
  methods: {
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
