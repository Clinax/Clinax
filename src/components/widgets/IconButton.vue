<template>
  <v-btn
    v-on="$listeners"
    :class="{ 'v-btn--active': active }"
    :color="active ? 'primary' : ''"
    :outlined="active"
    icon
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
