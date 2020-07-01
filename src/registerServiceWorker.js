/* eslint-disable no-console */

import { register } from "register-service-worker";
import store from "./store";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
      store.commit("setServiceWorkerState", "ready");
    },
    registered() {
      console.log("Service worker has been registered.");
      store.commit("setServiceWorkerState", "registered");
    },
    cached() {
      console.log("Content has been cached for offline use.");
      store.commit("setServiceWorkerState", "cached");
    },
    updatefound() {
      console.log("New content is downloading.");
      store.commit("setServiceWorkerState", "updatefound");
    },
    updated() {
      console.log("New content is available; please refresh.");
      store.commit("setServiceWorkerState", "updated");
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
      store.commit("setServiceWorkerState", "offline");
    },
    error(error) {
      console.error("Error during service worker registration:", error);
      store.commit("setServiceWorkerState", "error");
    },
  });
}
