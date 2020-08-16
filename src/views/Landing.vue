<template>
  <v-app>
    <v-app-bar
      color="white"
      class="elevation-1"
      height="98"
      inverted-scroll
      :scroll-threshold="$vuetify.breakpoint.height / 2"
      hide-on-scroll
      app
    >
      <router-link class="brand text--primary" to="/" contain>
        <v-img src="/img/logo.png" width="86"></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <template v-if="$store.state.token">
        <v-btn color="primary" class="mx-3" to="/app" outlined>
          Go to Console
        </v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" class="mx-3" to="/app" outlined>Login</v-btn>
        <v-btn color="primary" to="/app?new-account=true" depressed>
          Sign up
        </v-btn>
      </template>
    </v-app-bar>
    <v-main id="content" class="grey lighten-5">
      <div class="banner">
        <div class="banner--content">
          <v-toolbar class="flex-grow-0 transparent" height="98" flat>
            <v-spacer></v-spacer>
            <template v-if="$store.state.token">
              <span class="mr-1">Not</span>
              <b> {{ $store.state.user && $store.state.user.email }}</b>
              <span>?</span>
              <v-btn
                color="error"
                class="mx-3"
                @click="$store.dispatch('logout')"
                outlined
              >
                Logout
              </v-btn>
            </template>
            <template v-else>
              <span>Already have an account?</span>
              <v-btn color="primary" class="mx-3" to="/app" outlined>
                Login
              </v-btn>
            </template>
          </v-toolbar>
          <v-sheet max-width="640" class="mx-auto transparent flex-grow-1 px-4">
            <v-layout
              column
              justify-center
              fill-height
              align-center
              class="w-100"
            >
              <v-spacer></v-spacer>
              <v-img
                src="/img/logo.png"
                class="w-100"
                contain
                width="258"
              ></v-img>
              <p class="banner--text py-12 my-5">
                All in one solution for managing patients and appointments
              </p>
              <template v-if="$store.state.token">
                <v-btn color="primary" to="/app" rounded x-large>
                  Go to Console
                </v-btn>
              </template>
              <template v-else>
                <v-hover v-slot:default="{ hover }" class="mb-12">
                  <v-btn
                    :class="{
                      'elevation-12 white--text': hover,
                      'primary--text': !hover,
                    }"
                    class="animate"
                    :color="hover ? 'primary' : 'white'"
                    to="/app?new-account=true"
                    rounded
                    x-large
                  >
                    Get Started
                  </v-btn>
                </v-hover>
              </template>

              <v-spacer></v-spacer>
              <div class="my-12">
                <v-icon>mdi-chevron-double-down</v-icon>
              </div>
            </v-layout>
          </v-sheet>
        </div>
      </div>
      <!-- <v-container> </v-container> -->
      <v-slide-y-reverse-transition>
        <v-btn
          v-if="offsetTop > $vuetify.breakpoint.height / 2"
          color="primary"
          @click="$vuetify.goTo(0)"
          fab
          fixed
          bottom
          right
          class="ma-4"
        >
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    offsetTop: 0,
  }),

  created() {
    window.addEventListener(
      "scroll",
      (ev) => (this.offsetTop = ev.target.scrollingElement.scrollTop)
    );
  },
};
</script>

<style lang="scss">
.animate {
  transition: all 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
}
.banner {
  .v-btn {
    background: white;
    transition: all 550ms cubic-bezier(0.075, 0.82, 0.165, 1);
  }
}
</style>

<style lang="scss" scoped>
.banner {
  background: url("/img/background.jpg");
  height: 100vh;
  width: 100vw;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;

  &--content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(3px) bri;
  }
  &--text {
    text-align: center;
    font-size: 20pt;
    font-weight: thin;
  }
}
</style>
