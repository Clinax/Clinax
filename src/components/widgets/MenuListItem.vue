<template>
  <v-list-item v-on="$listeners" v-bind="link" :class="[bg]">
    <v-list-item-action v-if="icon">
      <v-badge :value="Boolean(badge)">
        <template v-slot:badge>{{ badge }}</template>
        <v-icon :color="color">{{ icon }}</v-icon>
      </v-badge>
    </v-list-item-action>
    <v-list-item-content :class="[textColor]">
      <v-list-item-title v-html="text"> </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action v-if="append">
      <v-icon>{{ append }}</v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    link: Object,
    text: String,
    append: String,
    textColor: String,
    color: String,
    badge: String,
    icon: String,
    bg: String,
  },
};
</script>

<style></style>
