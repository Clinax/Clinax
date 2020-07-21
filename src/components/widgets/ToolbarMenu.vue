<template>
  <v-menu v-model="model" v-bind="menuProps" min-width="190" bottom left>
    <template v-slot:activator="props">
      <slot name="activator" v-bind="props">
        <v-btn v-on="props.on" icon>
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
import Toggleable from "./Toggleable";

export default {
  extends: Toggleable,
  components: { MenuList: () => import("./MenuList") },
  props: {
    options: { type: Array, default: () => [] },
    hideHeader: Boolean,
    headerText: { type: String, default: () => "Menu" },
    activatorIcon: { type: String, default: () => "mdi-dots-vertical" },
    menuProps: Object,
  },
};
</script>

<style></style>
