<template>
  <v-list>
    <template v-for="option in options">
      <v-subheader v-if="option.header" :key="option.header">
        {{ option.header }}
      </v-subheader>
      <toolbar-menu
        v-else-if="option.items"
        :key="option.text"
        :options="option.items"
        :header-text="option.text"
        :menu-props="{ top: true, closeOnContentClick: true }"
      >
        <template v-slot:activator="{ on }">
          <menu-list-item
            v-bind="option"
            append="mdi-menu-right"
            v-on="on"
          ></menu-list-item>
        </template>
      </toolbar-menu>
      <menu-list-item
        v-else
        :key="option.text"
        v-bind="option"
        :class="[option.bg]"
        v-on="option.on"
      ></menu-list-item>
    </template>
  </v-list>
</template>

<script>
import MenuListItem from "./MenuListItem";

export default {
  components: { ToolbarMenu: () => import("./ToolbarMenu"), MenuListItem },
  props: {
    options: { type: Array, default: () => [] },
  },
};
</script>

<style></style>
