<template>
  <v-list>
    <v-subheader v-if="!hideHeader">{{ headerText }}</v-subheader>
    <v-list-item v-for="(option, i) in options" :class="[option.bg]" :key="i">
      <v-list-item-action v-if="option.icon">
        <v-badge :value="Boolean(option.badge)">
          <template v-slot:badge>{{ option.badge }}</template>
          <v-icon :color="option.color">{{ option.icon }}</v-icon>
        </v-badge>
      </v-list-item-action>
      <v-list-item-content :class="[option.textcolor]">
        <v-list-item-title v-html="option.text || option"> </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action v-if="option.append">
        <v-icon>{{ option.append }}</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    hideHeader: Boolean,
    headerText: { type: String, default: () => "Menu" },
    options: { type: Array, default: () => [] },
  },
};
</script>

<style></style>
