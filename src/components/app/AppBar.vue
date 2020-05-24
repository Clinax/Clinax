<template>
  <v-app-bar
    color="white"
    :extended="$store.state.app.extentedAppBar"
    :extension-height="$store.state.app.extensionHeight"
    elevate-on-scroll
    hide-on-scroll
    app
  >
    <v-divider
      style="position: absolute; left: 0; right: 0; bottom: 0;"
    ></v-divider>
    <v-app-bar-nav-icon @click="model = !model"> </v-app-bar-nav-icon>
    <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">
      {{ $store.state.app.title }}
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <search-bar> </search-bar>
    <v-spacer></v-spacer>

    <v-btn color="error" text @click="$store.dispatch('logout')">logout</v-btn>
    <template v-slot:extension v-if="$store.state.app.extentedAppBar">
      <portal-target name="app-bar-extension" class="w-100"> </portal-target>
    </template>
  </v-app-bar>
</template>

<script>
import ComponentWithModel from "../ComponentWithModel";
import SearchBar from "../SearchBar";

export default {
  extends: ComponentWithModel,
  components: { SearchBar },
};
</script>

<style>
.v-toolbar__extension {
  padding: 0 !important;
}
</style>
