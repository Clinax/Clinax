<template>
  <v-menu v-model="model" v-bind="menuProps" min-width="190" bottom left>
    <template v-slot:activator="props">
      <slot name="activator" v-bind="props">
        <v-btn icon v-on="props.on">
          <v-icon>{{ activatorIcon }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <menu-list
        :options="hideHeader ? options : [{ header: headerText }, ...options]"
      ></menu-list>
    </v-card>
  </v-menu>
</template>

<script>
import InputModel from "./InputModel";

export default {
  components: { MenuList: () => import("./MenuList") },
  extends: InputModel,
  props: {
    options: { type: Array, default: () => [] },
    hideHeader: Boolean,
    headerText: { type: String, default: () => "Menu" },
    menuProps: { type: Object, default: null },
    activatorIcon: { type: String, default: () => "mdi-dots-vertical" },
  },
};
</script>

<style></style>
