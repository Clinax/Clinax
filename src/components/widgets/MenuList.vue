<template>
  <v-list>
    <template v-for="option in options">
      <v-subheader v-if="option.header" :key="option.header">
        {{ option.header }}
      </v-subheader>
      <ToolbarMenu
        v-else-if="option.items"
        :options="option.items"
        :header-text="option.text"
        :key="option.text"
        :menu-props="{ top: true, closeOnContentClick: true }"
      >
        <template v-slot:activator="{ on }">
          <menu-list-item
            v-on="on"
            v-bind="option"
            append="mdi-menu-right"
          ></menu-list-item>
        </template>
      </ToolbarMenu>
      <menu-list-item
        v-else
        v-on="option.on"
        v-bind="option"
        :class="[option.bg]"
        :key="option.text"
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
