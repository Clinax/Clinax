<template>
  <v-app>
    <template v-if="$store.state.user">
      <app-bar v-if="appbarVisibility" v-model="navbar"></app-bar>
      <nav-bar v-if="navbarVisibility" v-model="navbar"></nav-bar>

      <v-main class="grey lighten-4">
        <router-view></router-view>
      </v-main>
      <snackbar v-model="snackbar.value" v-bind="snackbar"></snackbar>
    </template>
    <loading-dialog v-else :value="true" text="Signing in..."></loading-dialog>
  </v-app>
</template>

<script>
import AppBar from "./AppBar";
import NavBar from "./NavBar";
import LoadingDialog from "@/components/widgets/LoadingDialog";

export default {
  components: { AppBar, NavBar, LoadingDialog },
  computed: {
    snackbar() {
      return this.$store.state.app.snackbar;
    },
    navbar: {
      get() {
        return this.$store.state.app.navbar;
      },
      set(v) {
        this.$store.state.app.navbar = v;
      },
    },
    navbarVisibility() {
      return this.$store.state.app.navbarVisibility;
    },
    appbarVisibility() {
      return this.$store.state.app.appbarVisibility;
    },
  },
};
</script>

<style></style>
