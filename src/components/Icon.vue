<template>
  <v-icon v-if="icon.indexOf('mdi') != -1" :large="large" :color="color">
    <slot>{{ icon }}</slot>
  </v-icon>
  <i v-else class="material-icons" v-bind:class="classes" v-bind:style="style">
    <slot>{{ icon }}</slot>
  </i>
</template>

<script>
export default {
  props: {
    icon: String,
    color: String,
    large: String,
  },
  data: () => ({
    classes: "",
    style: "",
  }),
  mounted() {
    if (this.color)
      if (this.color.indexOf("#") != -1) {
        this.style = "color: " + this.color;
      } else this.classes = `${this.color}--text`;
    else this.style = "color: rgba(0, 0, 0, .54)";
  },
};
</script>

<style lang="scss">
.v-list-item--active {
  .material-icons {
    color: inherit !important;
  }
}
i {
  transition: 200ms cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
