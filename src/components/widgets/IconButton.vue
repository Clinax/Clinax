<template>
  <v-btn
    :class="{ 'v-btn--active': active }"
    :color="active ? 'primary' : ''"
    :outlined="active"
    icon
    v-on="$listeners"
  >
    <icon v-bind="$props"> </icon>
  </v-btn>
</template>

<script>
import Icon from "./Icon";

export default {
  components: { Icon },
  props: {
    active: Boolean,
    ...Icon.props,
  },
};
</script>

<style></style>
