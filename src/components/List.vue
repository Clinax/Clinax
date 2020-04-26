<template>
  <v-list
    :shaped="shaped"
    :dense="dense"
    :nav="nav"
    :flat="noActive"
    :two-line="twoLine"
  >
    <slot></slot>
    <template v-for="(item, index) in items">
      <v-subheader
        v-if="item.header"
        :key="item.header"
        v-text="item.header"
      ></v-subheader>
      <v-divider v-else-if="item.divider" :key="'divider-' + index"></v-divider>
      <v-list-item v-else :key="'item-' + index" :to="item.to">
        <v-list-item-action v-if="item.icon">
          <icon :icon="item.icon"></icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            v-html="item.text"
            class="text-nowrap"
            :class="{ 'grey--text text--darken-3': noActive }"
          ></v-list-item-title>
          <v-list-item-subtitle
            v-if="item.subText"
            v-html="item.subText"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action v-if="item.append || item.appendText">
          <v-list-item-action-text
            v-if="item.appendText"
            v-text="item.appendText"
          ></v-list-item-action-text>
          <icon
            v-if="item.append"
            :small="smallAction"
            :icon="item.append"
            :color="item.appendColor"
            :class="{ 'grey--text text--darken-1': noActive }"
          ></icon>
        </v-list-item-action>
      </v-list-item>
    </template>
    <slot name="extra"></slot>
  </v-list>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
    shaped: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    nav: { type: Boolean, default: false },
    noActive: { type: Boolean, default: false },
    smallAction: { type: Boolean, default: false },
    twoLine: { type: Boolean, default: false },
  },
};
</script>
