<template>
  <v-app-bar
    color="white"
    :extended="$store.state.app.extentedAppBar"
    elevate-on-scroll
    dense
    app
  >
    <v-app-bar-nav-icon v-if="!active" @click="model = !model">
    </v-app-bar-nav-icon>
    <v-toolbar-title v-if="!isMobile">
      {{ $store.state.app.title }}
    </v-toolbar-title>

    <v-spacer v-if="!active"></v-spacer>
    <search-bar v-if="!isMobile" class="mx-3 flex-grow-1"> </search-bar>
    <v-spacer v-if="!active"></v-spacer>
    <v-btn
      v-if="!active"
      color="error"
      v-bind="
        isMobile ? { fab: true, xSmall: true, depressed: true } : { text: true }
      "
      @click="$store.dispatch('logout')"
    >
      <v-icon>mdi-logout</v-icon>
      <span v-if="!isMobile" class="ml-2">logout</span>
    </v-btn>
    <template v-if="$store.state.app.extentedAppBar" v-slot:extension>
      <portal-target name="appbar-extension" class="w-100"> </portal-target>
    </template>
  </v-app-bar>
</template>

<script>
import InputModel from "@/components/widgets/InputModel";
import SearchBar from "@/components/app/widgets/SearchBar";

export default {
  components: { SearchBar },
  extends: InputModel,
  data() {
    return {
      active: false,
    };
  },
};
</script>

<style>
.v-toolbar__extension {
  padding: 0 !important;
}
</style>
