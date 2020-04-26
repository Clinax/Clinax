<template>
  <app v-if="token"></app>
  <auth v-else></auth>
</template>

<script>
import App from "@/components/app";
import Auth from "@/views/Auth";

export default {
  name: "App",
  components: { App, Auth },

  computed: {
    token() {
      return this.$store.state.token;
    },
  },
};
</script>

<style lang="scss">
.flex-grow-1 {
  flex-grow: 1;
}
</style>
