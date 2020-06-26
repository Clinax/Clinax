<template>
  <v-list
    :shaped="shaped"
    :dense="dense"
    :nav="nav"
    :flat="noActive"
    :two-line="twoLine"
  >
    <slot> </slot>
    <template v-for="(item, index) in items">
      <v-subheader
        v-if="item.header"
        :key="item.header"
        v-text="item.header"
      ></v-subheader>
      <v-divider
        v-else-if="item.divider"
        :key="'divider-' + index"
        class="my-0"
      ></v-divider>
      <v-list-group
        v-model="item.model"
        v-else-if="item.subLinks"
        :key="item.title"
        :dense="!!item.dense"
        :nav="false"
      >
        <template v-slot:activator>
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list dense class="animate">
          <v-list-item
            :dense="!!subItem.dense"
            v-for="subItem in item.subLinks"
            :key="subItem.title"
            class="animate"
            :class="{
              'v-list-item--active': $route.path == subItem.to,
              'pl-6 ': item.model,
            }"
            @click="$route.path == subItem.to || $router.push(subItem.to)"
          >
            <v-list-item-action v-if="subItem.icon">
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-group>
      <v-list-item
        v-else
        :key="'item-' + index"
        :class="{ 'v-list-item--active': $route.path == item.to }"
        @click="$route.path == item.to || $router.push(item.to)"
        :dense="!!item.dense"
      >
        <v-list-item-action v-if="item.icon">
          <v-badge
            :color="item.badgeColor"
            icon="mdi-lock"
            dot
            top
            right
            bordered
            :value="!!item.badge"
          >
            <template v-slot:badge>
              <span>{{ item.badge }}</span>
            </template>
            <icon :icon="item.icon"></icon>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-subtitle
            v-if="item.subText"
            v-text="item.subText"
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
