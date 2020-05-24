<template>
  <v-fade-transition absolute>
    <app-layout v-if="token" key="1" style="top: 0;"></app-layout>
    <auth v-else key="2" style="top: 0;"></auth>
  </v-fade-transition>
</template>

<script>
import AppLayout from "./app/AppLayout";
import Auth from "@/views/Auth";

export default {
  name: "App",
  components: { AppLayout, Auth },

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
.border-bottom {
  border-bottom: 1px solid #676767 !important;
}
</style>
