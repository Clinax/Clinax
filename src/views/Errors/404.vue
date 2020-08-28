<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-layout fill-height align-center justify-center column>
          <img src="@/assets/404.svg" class="w-auto" height="398px" />
          <p class="my-12 body-1 text--secondary">
            The page you are looking you doesn't exist...
          </p>
          <v-btn
            v-if="this.$store.state.token"
            color="primary"
            to="/app"
            replace
          >
            Take me to console
          </v-btn>
          <v-btn v-else to.replace="/">Take me home</v-btn>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {};
</script>

<style></style>
