import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "Welcome to ClinaX",
      path: "/",
      component: () => import("./views/Landing"),
    },
    {
      path: "/app",
      component: () => import("./components/Application"),
      children: [
        {
          name: "Patients",
          path: "patients",
          component: () => import("./views/core/Patient"),
        },
        {
          name: "Patient Case",
          path: "case/:patientId",
          component: () => import("./views/core/Case"),
          props: true,
        },
        {
          name: "Patient FollowUp",
          path: "case/:patientId/:followUpId",
          component: () => import("./views/core/Case"),
          props: true,
        },
        {
          name: "Contacts",
          path: "contacts",
          component: () => import("./views/tools/Contacts"),
        },
        {
          name: "Inventory to-do",
          path: "inventory",
          component: () => import("./views/tools/InventoryTodo"),
        },
        {
          name: "Appointments",
          path: "appointments",
          component: () => import("./views/tools/Appointments"),
        },
        {
          name: "Console",
          path: "/",
          component: Home,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About"),
    },
    {
      name: "Page Not Found",
      path: "*",
      component: () => import("./views/Errors/404"),
    },
  ],
});
