<template>
  <v-menu v-model="model">
    <template v-slot:activator="props">
      <slot name="activator" v-bind="props">
        <v-btn v-on="props.on" icon>
          <v-icon>{{ activatorIcon }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card>
      <slot>
        <menu-list :options="options"></menu-list>
      </slot>
    </v-card>
  </v-menu>
</template>

<script>
import Toggleable from "./Toggleable";
import MenuList from "./MenuList";
// eslint-disable-next-line no-console

export default {
  extends: Toggleable,
  components: { MenuList },
  props: {
    activatorIcon: { type: String, default: () => "mdi-dots-vertical" },
    ...MenuList.props,
  },
};
</script>

<style></style>
